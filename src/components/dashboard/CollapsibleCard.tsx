"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="pb-3 cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {extra}
            <Chevron open={open} />
          </div>
        </div>
      </CardHeader>
      {open && <CardContent className={contentClassName}>{children}</CardContent>}
    </Card>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform duration-200 text-muted-foreground", !open && "-rotate-90")}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
