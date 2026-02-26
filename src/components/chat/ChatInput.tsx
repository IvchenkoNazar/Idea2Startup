"use client";

import { useTranslations } from "next-intl";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  isLoading: boolean;
  searchingTool?: string | null;
};

export function ChatInput({ value, onChange, onSend, onStop, isLoading, searchingTool }: Props) {
  const t = useTranslations();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="border-t bg-background p-4">
      {searchingTool && (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Searching {searchingTool === "search_producthunt" ? "Product Hunt" : "the web"}...
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("workspace.chatPlaceholder")}
          rows={1}
          disabled={isLoading}
          className={cn(
            "flex-1 resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none",
            "focus:ring-2 focus:ring-ring focus:ring-offset-0",
            "disabled:opacity-50 max-h-40 overflow-y-auto"
          )}
        />
        {isLoading ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onStop}
            className="shrink-0 rounded-xl h-10 w-10"
          >
            <span className="h-3 w-3 rounded-sm bg-foreground" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!value.trim()}
            size="icon"
            className="shrink-0 rounded-xl h-10 w-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
