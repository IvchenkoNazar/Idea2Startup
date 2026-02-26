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
    <Card className="overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left bg-gradient-to-r from-muted/60 to-muted/20 hover:from-muted/80 hover:to-muted/40 transition-colors px-4 py-3 border-b border-border/50"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
            {title}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {extra}
            {tooltip && <InfoTooltip text={tooltip} />}
            <Chevron open={open} />
          </div>
        </div>
      </button>
      {open && <CardContent className={cn("pt-4", contentClassName)}>{children}</CardContent>}
    </Card>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div
      className="relative group/tooltip"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground/60 hover:text-muted-foreground hover:border-muted-foreground/60 transition-colors cursor-help">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </div>
      <div className="absolute bottom-full right-0 mb-2 w-52 rounded-lg border bg-popover shadow-lg text-xs p-2.5 text-popover-foreground opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-150 z-50 leading-relaxed">
        {text}
        <div className="absolute top-full right-2 border-4 border-transparent border-t-popover" />
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
