"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import type { Message, ArtifactUpdate } from "@/types/chat";
import { useChat } from "@/hooks/useChat";

type Props = {
  ideaId: string;
  locale: string;
  ideaTitle?: string;
  initialMessages: Message[];
  onArtifact: (artifact: ArtifactUpdate) => void;
};

export function ChatWindow({ ideaId, locale, ideaTitle, initialMessages, onArtifact }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    setInput,
    isLoading,
    streamingContent,
    searchingTool,
    generatingArtifact,
    sendMessage,
    stop,
  } = useChat({ ideaId, locale, initialMessages, onArtifact });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const isEmpty = messages.length === 0 && !streamingContent;

  return (
    <div className="flex h-full flex-col bg-muted/30">
      {/* Chat area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isEmpty ? (
            <WelcomeScreen ideaTitle={ideaTitle} onSend={sendMessage} />
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
              ))}
              {streamingContent && (
                <MessageBubble role="assistant" content={streamingContent} isStreaming />
              )}
              {generatingArtifact && (
                <ArtifactIndicator type={generatingArtifact} />
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-background border-t">
        <div className="max-w-2xl mx-auto w-full">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            onStop={stop}
            isLoading={isLoading}
            searchingTool={searchingTool}
          />
        </div>
      </div>
    </div>
  );
}

const ARTIFACT_META: Record<string, { icon: string; key: string }> = {
  idea_summary: { icon: "💡", key: "ideaSummary" },
  competitors:  { icon: "🔍", key: "competitors" },
  uvp:          { icon: "💎", key: "uvp" },
  lean_canvas:  { icon: "📋", key: "leanCanvas" },
  score:        { icon: "📊", key: "score" },
};

function ArtifactIndicator({ type }: { type: string }) {
  const t = useTranslations("artifacts");
  const meta = ARTIFACT_META[type];
  const label = meta ? `${meta.icon} ${t(meta.key as Parameters<typeof t>[0])}` : type;

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
        AI
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm text-foreground">
        <span className="animate-spin text-base">⚙️</span>
        <span className="text-muted-foreground">
          {t("generatingArtifact")} <span className="font-medium text-foreground">{label}</span>
        </span>
        <span className="flex gap-0.5 ml-1">
          <span className="animate-bounce [animation-delay:0ms] text-muted-foreground">·</span>
          <span className="animate-bounce [animation-delay:150ms] text-muted-foreground">·</span>
          <span className="animate-bounce [animation-delay:300ms] text-muted-foreground">·</span>
        </span>
      </div>
    </div>
  );
}

function WelcomeScreen({
  ideaTitle,
  onSend,
}: {
  ideaTitle?: string;
  onSend: (text: string) => void;
}) {
  const t = useTranslations("workspace");
  const prompts = [t("prompt1"), t("prompt2"), t("prompt3"), t("prompt4")];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
        💡
      </div>
      <h2 className="text-2xl font-bold mb-2">{ideaTitle ?? "New Idea"}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {t("welcomeSubtitle")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSend(prompt)}
            className="rounded-xl border bg-background px-4 py-3 text-sm text-left hover:bg-accent transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
