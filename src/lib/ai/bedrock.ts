import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
  type Message,
  type Tool,
  type ContentBlock,
} from "@aws-sdk/client-bedrock-runtime";

const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? "us.anthropic.claude-sonnet-4-6";

function getClient() {
  return new BedrockRuntimeClient({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export type StreamChunk =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: "done" };

export async function* streamChat(
  messages: Message[],
  systemPrompt: string,
  tools?: Tool[]
): AsyncGenerator<StreamChunk> {
  const client = getClient();

  const command = new ConverseStreamCommand({
    modelId: MODEL_ID,
    system: [{ text: systemPrompt }],
    messages,
    inferenceConfig: {
      maxTokens: 4096,
      temperature: 0.7,
    },
    ...(tools && tools.length > 0 ? { toolConfig: { tools } } : {}),
  });

  const response = await client.send(command);

  if (!response.stream) {
    throw new Error("No stream in response");
  }

  let currentToolId = "";
  let currentToolName = "";
  let toolInputBuffer = "";

  for await (const event of response.stream) {
    if (event.contentBlockStart?.start?.toolUse) {
      const toolUse = event.contentBlockStart.start.toolUse;
      currentToolId = toolUse.toolUseId ?? "";
      currentToolName = toolUse.name ?? "";
      toolInputBuffer = "";
    } else if (event.contentBlockDelta?.delta?.text) {
      yield { type: "text", text: event.contentBlockDelta.delta.text };
    } else if (event.contentBlockDelta?.delta?.toolUse?.input) {
      toolInputBuffer += event.contentBlockDelta.delta.toolUse.input;
    } else if (event.contentBlockStop && currentToolId) {
      try {
        const input = JSON.parse(toolInputBuffer);
        yield { type: "tool_use", id: currentToolId, name: currentToolName, input };
      } catch {
        // ignore malformed tool input
      }
      currentToolId = "";
      currentToolName = "";
      toolInputBuffer = "";
    }
  }

  yield { type: "done" };
}

export function buildMessages(
  history: { role: string; content: string }[]
): Message[] {
  return history.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: [{ text: msg.content } as ContentBlock],
  }));
}
