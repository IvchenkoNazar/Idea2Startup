export type ArtifactAction = "create" | "update" | "replace";

export type ParsedArtifact = {
  type: string;
  action: ArtifactAction;
  data: Record<string, unknown>;
};

export type ParsedChunk =
  | { kind: "text"; text: string }
  | { kind: "artifact"; artifact: ParsedArtifact };

/**
 * Parses a full AI response string into text and artifact chunks.
 * Artifacts are wrapped in <artifact type="..." action="...">JSON</artifact> tags.
 */
export function parseResponse(response: string): ParsedChunk[] {
  const chunks: ParsedChunk[] = [];
  const artifactRegex = /<artifact\s+type="([^"]+)"\s+action="([^"]+)">([\s\S]*?)<\/artifact>/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = artifactRegex.exec(response)) !== null) {
    // Text before the artifact
    if (match.index > lastIndex) {
      const text = response.slice(lastIndex, match.index).trim();
      if (text) chunks.push({ kind: "text", text });
    }

    // Parse artifact
    try {
      const data = JSON.parse(match[3].trim());
      chunks.push({
        kind: "artifact",
        artifact: {
          type: match[1],
          action: match[2] as ArtifactAction,
          data,
        },
      });
    } catch {
      // If JSON is malformed, treat as text
      chunks.push({ kind: "text", text: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last artifact
  if (lastIndex < response.length) {
    const text = response.slice(lastIndex).trim();
    if (text) chunks.push({ kind: "text", text });
  }

  return chunks;
}

/**
 * Stream-aware buffer that detects artifact tags in real-time.
 * Emits text immediately, holds back content inside artifact tags.
 */
export class StreamParser {
  private buffer = "";
  private inArtifact = false;

  process(chunk: string): { text: string; flush: boolean } {
    this.buffer += chunk;

    if (!this.inArtifact) {
      const artifactStart = this.buffer.indexOf("<artifact");
      if (artifactStart === -1) {
        // No artifact tag — emit everything except last 20 chars (could be start of <artifact)
        const safeLength = Math.max(0, this.buffer.length - 20);
        const text = this.buffer.slice(0, safeLength);
        this.buffer = this.buffer.slice(safeLength);
        return { text, flush: false };
      } else {
        // Emit text before artifact start
        const text = this.buffer.slice(0, artifactStart);
        this.buffer = this.buffer.slice(artifactStart);
        this.inArtifact = true;
        return { text, flush: false };
      }
    }

    // We're inside an artifact — check if it's complete
    const artifactEnd = this.buffer.indexOf("</artifact>");
    if (artifactEnd !== -1) {
      this.inArtifact = false;
      this.buffer = this.buffer.slice(artifactEnd + "</artifact>".length);
      return { text: "", flush: true };
    }

    return { text: "", flush: false };
  }

  flush(): string {
    const remaining = this.buffer;
    this.buffer = "";
    return remaining;
  }

  getBuffer(): string {
    return this.buffer;
  }
}
