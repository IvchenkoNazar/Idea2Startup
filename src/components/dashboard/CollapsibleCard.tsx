"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
  contentClassName?: string;
  defaultOpen?: boolean;
};

export function CollapsibleCard({
  title,
  children,
  extra,
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
            <Chevron open={open} />
          </div>
        </div>
      </button>
      {open && <CardContent className={cn("pt-4", contentClassName)}>{children}</CardContent>}
    </Card>
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
