"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { CollapsibleCard } from "./CollapsibleCard";

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
    <CollapsibleCard
      title={<>💡 {t("ideaSummary")}</>}
      extra={<Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-0 text-[10px]">{data.category}</Badge>}
      contentClassName="space-y-3"
    >
      <h3 className="font-bold text-base leading-tight">{data.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
      <div className="space-y-2">
        <Row label={t("problem")} value={data.problem} color="red" />
        <Row label={t("target")} value={data.targetAudience} color="blue" />
      </div>
    </CollapsibleCard>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: "red" | "blue" }) {
  const accent = color === "red"
    ? "border-l-red-400 bg-red-50 dark:bg-red-950/20"
    : "border-l-blue-400 bg-blue-50 dark:bg-blue-950/20";
  return (
    <div className={`rounded-r-lg border-l-2 px-3 py-2 ${accent}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
