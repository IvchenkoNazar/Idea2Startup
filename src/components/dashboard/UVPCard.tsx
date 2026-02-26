"use client";

import { useTranslations } from "next-intl";
import { CollapsibleCard } from "./CollapsibleCard";

type Differentiator = {
  feature: string;
  description: string;
  competitorComparison: string;
};

type Props = {
  data: {
    statement: string;
    differentiators: Differentiator[];
  };
};

export function UVPCard({ data }: Props) {
  const t = useTranslations("artifacts");
  return (
    <CollapsibleCard title={<>💎 {t("uvp")}</>}>
      <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 px-4 py-3">
        <p className="text-sm font-medium leading-relaxed italic">"{data.statement}"</p>
      </div>
      {(data.differentiators ?? []).length > 0 && (
        <div className="space-y-2">
          {(data.differentiators ?? []).map((d, i) => (
            <div key={d.feature} className="rounded-lg border bg-muted/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold">⚡ {d.feature}</p>
              </div>
              <p className="text-xs text-muted-foreground mb-1 ml-7">{d.description}</p>
              <p className="text-xs text-muted-foreground/70 italic ml-7">↳ {t("vsCompetitors")}: {d.competitorComparison}</p>
            </div>
          ))}
        </div>
      )}
    </CollapsibleCard>
  );
}
