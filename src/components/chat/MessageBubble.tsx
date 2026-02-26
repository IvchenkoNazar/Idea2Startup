import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Props = {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export function MessageBubble({ role, content, isStreaming }: Props) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? "U" : "AI"}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            code: ({ children }) => (
              <code className="rounded bg-black/10 px-1 py-0.5 text-xs font-mono">
                {children}
              </code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {isStreaming && (
          <span className="inline-block h-4 w-0.5 animate-pulse bg-current ml-0.5" />
        )}
      </div>
    </div>
  );
}
