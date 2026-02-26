"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  data: {
    title: string;
    description: string;
    problem: string;
    targetAudience: string;
    category: string;
  };
};

export function IdeaSummaryCard({ data }: Props) {
  const t = useTranslations("artifacts");
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            💡 {t("ideaSummary")}
          </CardTitle>
          <Badge variant="secondary">{data.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <h3 className="font-bold text-lg leading-tight">{data.title}</h3>
        <p className="text-sm text-muted-foreground">{data.description}</p>
        <div className="space-y-2">
          <Row label={t("problem")} value={data.problem} />
          <Row label={t("target")} value={data.targetAudience} />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
