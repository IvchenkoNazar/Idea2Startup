"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { CollapsibleCard } from "./CollapsibleCard";

type Criterion = {
  name: string;
  score: number;
  weight: number;
  explanation: string;
};

type Props = {
  data: {
    total: number;
    criteria: Criterion[];
    verdict: string;
    recommendations: string[];
  };
};

export function ScoreCard({ data }: Props) {
  const t = useTranslations("artifacts");
  const color = data.total >= 70 ? "text-green-600" : data.total >= 50 ? "text-yellow-600" : "text-red-500";

  return (
    <CollapsibleCard title={<>📊 {t("score")}</>}>
      <div className="flex items-center justify-center py-4">
        <div className="text-center">
          <p className={`text-6xl font-bold ${color}`}>{data.total}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("outOf")}</p>
        </div>
      </div>
      <div className="space-y-3">
        {(data.criteria ?? []).map((c) => (
          <div key={c.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.score}/100</span>
            </div>
            <Progress value={c.score} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{c.explanation}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-xs font-semibold mb-1">{t("verdict")}</p>
        <p className="text-sm text-muted-foreground">{data.verdict}</p>
      </div>
      {(data.recommendations ?? []).length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2">{t("nextSteps")}</p>
          <ul className="space-y-1">
            {data.recommendations.map((r, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-primary font-bold">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsibleCard>
  );
}
