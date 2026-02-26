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
    <div className="h-full flex flex-col bg-gradient-to-b from-muted/40 via-background to-background border-l">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-sm">📊</div>
          <div>
            <h2 className="text-sm font-semibold leading-tight">{t("liveTitle")}</h2>
            <p className="text-[11px] text-muted-foreground">{t("liveSubtitle")}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
        {!hasAny ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl mb-3">📊</div>
            <p className="text-sm font-medium">{t("emptyTitle")}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{t("emptyHint")}</p>
          </div>
        ) : (
          <div className="space-y-3">
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
