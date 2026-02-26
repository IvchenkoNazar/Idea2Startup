"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          💎 {t("uvp")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
          <p className="text-sm font-medium leading-relaxed">{data.statement}</p>
        </div>
        {(data.differentiators ?? []).length > 0 && (
          <div className="space-y-2">
            {(data.differentiators ?? []).map((d) => (
              <div key={d.feature} className="rounded-lg border p-3">
                <p className="text-sm font-semibold mb-1">⚡ {d.feature}</p>
                <p className="text-xs text-muted-foreground mb-1">{d.description}</p>
                <p className="text-xs text-muted-foreground italic">{t("vsCompetitors")}: {d.competitorComparison}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
