"use client";

import { useTranslations } from "next-intl";
import { IdeaSummaryCard } from "./IdeaSummaryCard";
import { CompetitorCard } from "./CompetitorCard";
import { UVPCard } from "./UVPCard";
import { LeanCanvasCard } from "./LeanCanvasCard";
import { ScoreCard } from "./ScoreCard";
import type { ArtifactUpdate } from "@/types/chat";

type Props = {
  artifacts: Record<string, ArtifactUpdate>;
};

export function LiveDashboard({ artifacts }: Props) {
  const t = useTranslations("artifacts");
  const hasAny = Object.keys(artifacts).length > 0;

  return (
    <div className="h-full flex flex-col border-l bg-background">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">{t("liveTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("liveSubtitle")}</p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {!hasAny ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm font-medium">{t("emptyTitle")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("emptyHint")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {artifacts.idea_summary && (
              <Animated>
                <IdeaSummaryCard data={artifacts.idea_summary.data as Parameters<typeof IdeaSummaryCard>[0]["data"]} />
              </Animated>
            )}
            {artifacts.competitors && (
              <Animated>
                <CompetitorCard data={artifacts.competitors.data as Parameters<typeof CompetitorCard>[0]["data"]} />
              </Animated>
            )}
            {artifacts.uvp && (
              <Animated>
                <UVPCard data={artifacts.uvp.data as Parameters<typeof UVPCard>[0]["data"]} />
              </Animated>
            )}
            {artifacts.lean_canvas && (
              <Animated>
                <LeanCanvasCard data={artifacts.lean_canvas.data as Parameters<typeof LeanCanvasCard>[0]["data"]} />
              </Animated>
            )}
            {artifacts.score && (
              <Animated>
                <ScoreCard data={artifacts.score.data as Parameters<typeof ScoreCard>[0]["data"]} />
              </Animated>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Animated({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      {children}
    </div>
  );
}
