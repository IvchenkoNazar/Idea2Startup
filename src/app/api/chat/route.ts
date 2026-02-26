import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { streamChat, buildMessages } from "@/lib/ai/bedrock";
import { getSystemPrompt, type Stage } from "@/lib/ai/prompts";
import { parseResponse } from "@/lib/ai/parser";
import { webSearch } from "@/lib/search/serper";
import { searchProductHunt } from "@/lib/search/producthunt";
import type { Tool } from "@aws-sdk/client-bedrock-runtime";

const SEARCH_TOOLS: Tool[] = [
  {
    toolSpec: {
      name: "web_search",
      description: "Search the web for market data, competitors, trends, and startup information",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
          },
          required: ["query"],
        },
      },
    },
  },
  {
    toolSpec: {
      name: "search_producthunt",
      description: "Search Product Hunt for existing startups and products similar to the idea",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            query: { type: "string", description: "Product Hunt search query" },
          },
          required: ["query"],
        },
      },
    },
  },
];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { ideaId, message, locale = "en" } = await req.json();

  // Load idea and history
  const [{ data: idea }, { data: history }] = await Promise.all([
    supabase.from("ideas").select("*").eq("id", ideaId).single(),
    supabase
      .from("messages")
      .select("role, content")
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: true }),
  ]);

  if (!idea) return new Response("Idea not found", { status: 404 });

  const stage = (idea.stage ?? "capture") as Stage;
  const systemPrompt = getSystemPrompt(stage, locale);
  const useTools = stage === "research" || stage === "competitors";

  // Save user message
  await supabase.from("messages").insert({
    idea_id: ideaId,
    role: "user",
    content: message,
  });

  // Build message history
  const allMessages = [
    ...(history ?? []),
    { role: "user", content: message },
  ];

  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: string) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${data}\n\n`)
        );
      };

      try {
        let messages = buildMessages(allMessages);

        // Agentic tool loop
        let continueLoop = true;
        while (continueLoop) {
          continueLoop = false;

          for await (const chunk of streamChat(messages, systemPrompt, useTools ? SEARCH_TOOLS : [])) {
            if (chunk.type === "text") {
              fullResponse += chunk.text;
              send("text", JSON.stringify({ text: chunk.text }));
            } else if (chunk.type === "tool_use") {
              send("tool_start", JSON.stringify({ name: chunk.name }));

              let results;
              if (chunk.name === "web_search") {
                results = await webSearch(chunk.input.query as string);
              } else if (chunk.name === "search_producthunt") {
                results = await searchProductHunt(chunk.input.query as string);
              }

              const toolResultContent = JSON.stringify(results ?? []);

              // Add assistant tool use + tool result to messages and continue
              messages = [
                ...messages,
                {
                  role: "assistant" as const,
                  content: [
                    {
                      toolUse: {
                        toolUseId: chunk.id,
                        name: chunk.name,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        input: chunk.input as any,
                      },
                    },
                  ],
                },
                {
                  role: "user" as const,
                  content: [
                    {
                      toolResult: {
                        toolUseId: chunk.id,
                        content: [{ text: toolResultContent }],
                      },
                    },
                  ],
                },
              ];
              continueLoop = true;
              break;
            } else if (chunk.type === "done") {
              // Process artifacts from full response
              const parsed = parseResponse(fullResponse);
              for (const chunk of parsed) {
                if (chunk.kind === "artifact") {
                  const { artifact } = chunk;

                  // Upsert artifact
                  const { data: existing } = await supabase
                    .from("artifacts")
                    .select("id, version")
                    .eq("idea_id", ideaId)
                    .eq("type", artifact.type)
                    .maybeSingle();

                  if (existing) {
                    await supabase
                      .from("artifacts")
                      .update({ data: artifact.data, version: existing.version + 1, updated_at: new Date().toISOString() })
                      .eq("id", existing.id);
                  } else {
                    await supabase.from("artifacts").insert({
                      idea_id: ideaId,
                      type: artifact.type,
                      data: artifact.data,
                    });
                  }

                  send("artifact", JSON.stringify({ type: artifact.type, data: artifact.data }));
                }
              }

              // Extract clean text (no artifact XML)
              const cleanText = parsed
                .filter((c) => c.kind === "text")
                .map((c) => c.kind === "text" ? c.text : "")
                .join("\n\n")
                .trim();

              // Save assistant message
              await supabase.from("messages").insert({
                idea_id: ideaId,
                role: "assistant",
                content: cleanText || fullResponse,
              });

              // Auto-advance stage if scoring artifact was generated
              if (parsed.some((c) => c.kind === "artifact" && c.artifact.type === "score")) {
                await supabase.from("ideas").update({ stage: "scoring" }).eq("id", ideaId);
              }

              send("done", "{}");
            }
          }
        }
      } catch (err) {
        console.error("Chat error:", err);
        send("error", JSON.stringify({ message: "AI error occurred" }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
