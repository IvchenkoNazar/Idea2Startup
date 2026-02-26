"use client";

import { useState, useCallback, useRef } from "react";
import type { Message, ArtifactUpdate } from "@/types/chat";

function stripArtifacts(text: string): string {
  // Remove complete artifact blocks
  let result = text.replace(/<artifact[\s\S]*?<\/artifact>/g, "");
  // Remove incomplete artifact block still being streamed (no closing tag yet)
  result = result.replace(/<artifact[\s\S]*$/, "");
  return result.replace(/\n{3,}/g, "\n\n").trim();
}

type UseChatOptions = {
  ideaId: string;
  locale: string;
  initialMessages?: Message[];
  onArtifact?: (artifact: ArtifactUpdate) => void;
  onStageChange?: (stage: string) => void;
};

export function useChat({
  ideaId,
  locale,
  initialMessages = [],
  onArtifact,
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [searchingTool, setSearchingTool] = useState<string | null>(null);
  const [generatingArtifact, setGeneratingArtifact] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = text ?? input;
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setStreamingContent("");

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ideaId, message: content, locale }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error("Chat request failed");

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              // event type handled with next data line
            } else if (line.startsWith("data: ")) {
              const rawData = line.slice(6);
              // Find the last event type from previous lines
              const eventLine = lines[lines.indexOf(line) - 1];
              const eventType = eventLine?.replace("event: ", "") ?? "text";

              try {
                const data = JSON.parse(rawData);

                if (eventType === "text") {
                  accumulated += data.text;
                  setStreamingContent(stripArtifacts(accumulated));
                  // Detect if we're currently inside an artifact block
                  const lastOpen = accumulated.lastIndexOf("<artifact");
                  const lastClose = accumulated.lastIndexOf("</artifact>");
                  if (lastOpen > lastClose) {
                    const typeMatch = accumulated.slice(lastOpen).match(/type="([^"]+)"/);
                    setGeneratingArtifact(typeMatch ? typeMatch[1] : "unknown");
                  } else {
                    setGeneratingArtifact(null);
                  }
                } else if (eventType === "tool_start") {
                  setSearchingTool(data.name);
                } else if (eventType === "artifact") {
                  setSearchingTool(null);
                  onArtifact?.({ type: data.type, data: data.data });
                } else if (eventType === "done") {
                  setSearchingTool(null);
                  setGeneratingArtifact(null);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: crypto.randomUUID(),
                      role: "assistant",
                      content: stripArtifacts(accumulated),
                    },
                  ]);
                  setStreamingContent("");
                } else if (eventType === "error") {
                  throw new Error(data.message);
                }
              } catch (e) {
                if (e instanceof SyntaxError) continue;
                throw e;
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "Sorry, something went wrong. Please try again.",
            },
          ]);
        }
      } finally {
        setIsLoading(false);
        setStreamingContent("");
        setSearchingTool(null);
        setGeneratingArtifact(null);
      }
    },
    [ideaId, locale, input, isLoading, onArtifact]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setStreamingContent("");
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    streamingContent,
    searchingTool,
    generatingArtifact,
    sendMessage,
    stop,
  };
}
