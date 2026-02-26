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

export function Sidebar({ ideas }: { ideas: IdeaItem[] }) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      <div className="p-4">
        <Button className="w-full" asChild>
          <Link href="/dashboard">+ {t("sidebar.newIdea")}</Link>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {ideas.map((idea) => {
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
                    <span className="text-xs text-muted-foreground">
                      {idea.score}/100
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
