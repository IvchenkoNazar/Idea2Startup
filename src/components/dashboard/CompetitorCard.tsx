"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Competitor = {
  name: string;
  url: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  similarity: number;
};

type Props = {
  data: { competitors: Competitor[] };
};

export function CompetitorCard({ data }: Props) {
  const t = useTranslations("artifacts");
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          🔍 {t("competitors")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(data.competitors ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm font-medium">{t("noCompetitors")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("noCompetitorsHint")}</p>
          </div>
        )}
        {(data.competitors ?? []).map((c) => (
          <div key={c.name} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:underline">
                  {c.name}
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs">{c.pricing}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-20 shrink-0">{t("similarity")}</span>
              <Progress value={c.similarity} className="h-1.5 flex-1" />
              <span className="text-xs font-medium w-8 text-right">{c.similarity}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">✓ {t("strengths")}</p>
                <ul className="space-y-0.5">
                  {c.strengths.map((s) => <li key={s} className="text-xs text-muted-foreground">• {s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-red-500 mb-1">✗ {t("weaknesses")}</p>
                <ul className="space-y-0.5">
                  {c.weaknesses.map((w) => <li key={w} className="text-xs text-muted-foreground">• {w}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
