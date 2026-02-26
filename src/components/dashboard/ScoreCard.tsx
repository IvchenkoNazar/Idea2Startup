"use client";

import { useTranslations } from "next-intl";
import { CollapsibleCard } from "./CollapsibleCard";

type Criterion = {
  name: string;
  score: number;
  weight: number;
  explanation: string;
};

type Props = {
  data: {
    total?: number;
    score?: number;
    overall?: number;
    criteria?: unknown;
    breakdown?: unknown;
    verdict?: string;
    recommendations?: unknown;
  };
};

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (val) return [String(val)];
  return [];
}

function toCriteriaArray(val: unknown): Criterion[] {
  if (!Array.isArray(val)) return [];
  return val.filter((c) => c && typeof c === "object");
}

export function ScoreCard({ data }: Props) {
  const t = useTranslations("artifacts");

  const total = data.total ?? data.score ?? data.overall ?? 0;
  const criteria = toCriteriaArray(data.criteria ?? data.breakdown);
  const recommendations = toArray(data.recommendations);

  const ringColor = total >= 70 ? "#16a34a" : total >= 50 ? "#ca8a04" : "#dc2626";
  const textColor = total >= 70 ? "text-green-600" : total >= 50 ? "text-yellow-600" : "text-red-600";

  const R = 40;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference - (total / 100) * circumference;

  return (
    <CollapsibleCard title={<>📊 {t("score")}</>} tooltip={t("scoreTooltip")}>
      {/* Circular score ring */}
      <div className="flex items-center justify-center py-2">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/40" />
            <circle
              cx="50" cy="50" r={R} fill="none"
              stroke={ringColor} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold leading-none ${textColor}`}>{total}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{t("outOf")}</span>
          </div>
        </div>
      </div>

      {/* Criteria bars */}
      {criteria.length > 0 && (
        <div className="space-y-3">
          {criteria.map((c, i) => {
            const raw = c as Record<string, unknown>;
            const name = String(raw.name ?? raw.criterion ?? raw.criteria ?? raw.title ?? raw.label ?? raw.category ?? `Criterion ${i + 1}`);
            const s = Number(raw.score ?? raw.value ?? raw.points ?? 0);
            const explanation = String(raw.explanation ?? raw.description ?? raw.reason ?? raw.comment ?? "");
            const weight = raw.weight != null ? `${Math.round(Number(raw.weight) * 100)}%` : null;
            const barColor = s >= 70 ? "bg-green-500" : s >= 50 ? "bg-yellow-500" : "bg-red-500";
            const scoreColor = s >= 70 ? "text-green-600" : s >= 50 ? "text-yellow-600" : "text-red-600";
            return (
              <div key={i} className="rounded-lg border bg-muted/10 p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">{name}</span>
                    {weight && <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">×{weight}</span>}
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${scoreColor}`}>{s}<span className="text-xs font-normal text-muted-foreground">/100</span></span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${s}%` }} />
                </div>
                {explanation && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Verdict */}
      {data.verdict && (
        <div className="rounded-lg border-l-4 border-primary bg-primary/5 px-3 py-2.5">
          <p className="text-xs font-semibold text-primary mb-1">{t("verdict")}</p>
          <p className="text-sm text-muted-foreground">{data.verdict}</p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2">{t("nextSteps")}</p>
          <ul className="space-y-1.5">
            {recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsibleCard>
  );
}
