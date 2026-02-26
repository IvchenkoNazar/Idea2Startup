"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
  tooltip?: string;
  contentClassName?: string;
  defaultOpen?: boolean;
};

export function CollapsibleCard({
  title,
  children,
  extra,
  tooltip,
  contentClassName = "space-y-4",
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    // No overflow-hidden here — lets tooltip escape the card bounds
    <Card className="shadow-sm">
      {/* Header wrapper: relative so tooltip can be positioned inside it */}
      <div className="relative border-b border-border/50">
        {/* overflow-hidden only on button to clip gradient to card's rounded top corners */}
        <div className="overflow-hidden rounded-t-xl">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full text-left bg-gradient-to-r from-muted/60 to-muted/20 hover:from-muted/80 hover:to-muted/40 transition-colors px-4 py-3 pr-14"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
                {title}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {extra}
                <Chevron open={open} />
              </div>
            </div>
          </button>
        </div>

        {/* Tooltip anchor sits outside overflow-hidden, floats above everything */}
        {tooltip && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50">
            <InfoTooltip text={tooltip} />
          </div>
        )}
      </div>

      {open && <CardContent className={cn("pt-4", contentClassName)}>{children}</CardContent>}
    </Card>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group/tooltip">
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground/60 hover:text-muted-foreground hover:border-muted-foreground/60 transition-colors cursor-help"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>

      {/* Popup: renders above the icon, outside any overflow-hidden parent */}
      <div className="absolute bottom-full right-0 mb-2 w-56 rounded-lg border bg-popover shadow-xl text-xs p-2.5 text-popover-foreground opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-150 z-[200] leading-relaxed">
        {text}
        {/* Arrow */}
        <div className="absolute top-full right-2.5 border-[5px] border-transparent border-t-border" />
        <div className="absolute top-full right-[11px] border-[4px] border-transparent border-t-popover" />
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform duration-200 text-muted-foreground", !open && "-rotate-90")}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
