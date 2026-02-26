"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type IdeaItem = {
  id: string;
  title: string;
  stage: string;
  score: number | null;
};

type Props = {
  ideas: IdeaItem[];
  collapsed?: boolean;
  onToggle?: () => void;
};

export function Sidebar({ ideas, collapsed = false, onToggle }: Props) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-14" : "w-64"
      )}
    >
      {/* Top: new idea button + collapse toggle */}
      <div className={cn("flex items-center gap-1 p-2 border-b", collapsed && "justify-center")}>
        {!collapsed && (
          <Button className="flex-1 justify-start" asChild size="sm">
            <Link href="/dashboard">+ {t("sidebar.newIdea")}</Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-8 w-8"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-1 py-2">
        <div className="space-y-1">
          {collapsed ? (
            /* Collapsed: show dot indicators */
            ideas.map((idea) => {
              const isActive = pathname.includes(`/idea/${idea.id}`);
              return (
                <Link
                  key={idea.id}
                  href={`/idea/${idea.id}`}
                  title={idea.title}
                  className={cn(
                    "flex items-center justify-center h-9 w-full rounded-md transition-colors hover:bg-accent",
                    isActive && "bg-accent"
                  )}
                >
                  <span className="text-base">💡</span>
                </Link>
              );
            })
          ) : (
            /* Expanded: full list */
            ideas.map((idea) => {
              const isActive = pathname.includes(`/idea/${idea.id}`);
              return (
                <Link
                  key={idea.id}
                  href={`/idea/${idea.id}`}
                  className={cn(
                    "flex flex-col gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    isActive && "bg-accent"
                  )}
                >
                  <span className="font-medium truncate">{idea.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {t(`stages.${idea.stage}` as Parameters<typeof t>[0])}
                    </Badge>
                    {idea.score !== null && (
                      <span className="text-xs text-muted-foreground">{idea.score}/100</span>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
