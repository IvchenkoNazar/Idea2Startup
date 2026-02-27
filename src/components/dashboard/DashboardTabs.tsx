"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { IdeaCard } from "./IdeaCard";
import { cn } from "@/lib/utils";

type Idea = {
  id: string;
  title: string;
  stage: string;
  score: number | null;
  status: string;
  updated_at: string;
};

type Props = {
  ideas: Idea[];
  locale: string;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function DashboardTabs({ ideas, locale, onArchive, onRestore, onDelete }: Props) {
  const t = useTranslations("dashboard");
  const [tab, setTab] = useState<"active" | "archived">("active");

  const filtered = ideas.filter((i) => i.status === tab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-border">
        {(["active", "archived"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              tab === key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t(key)}
          </button>
        ))}
      </div>

      {/* Idea list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">
              {tab === "active" ? t("noIdeas") : t("noArchivedIdeas")}
            </p>
            <p className="text-sm text-muted-foreground">
              {tab === "active" ? t("noIdeasHint") : t("noArchivedIdeasHint")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              locale={locale}
              onArchive={onArchive}
              onRestore={onRestore}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
