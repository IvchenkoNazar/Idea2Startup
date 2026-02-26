"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: {
    problem: string[];
    solution: string[];
    keyMetrics: string[];
    uniqueAdvantage: string;
    channels: string[];
    customerSegments: string[];
    costStructure: string[];
    revenueStreams: string[];
    unfairAdvantage: string;
  };
};

export function LeanCanvasCard({ data }: Props) {
  const t = useTranslations("artifacts");
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          📋 {t("leanCanvas")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Section title="Problem" items={data.problem} color="red" />
          <Section title="Solution" items={data.solution} color="green" />
          <Section title="Key Metrics" items={data.keyMetrics} color="blue" />
          <Section title="Channels" items={data.channels} color="purple" />
          <Section title="Customer Segments" items={data.customerSegments} color="orange" />
          <Section title="Revenue Streams" items={data.revenueStreams} color="green" />
          <Section title="Cost Structure" items={data.costStructure} color="red" />
          <div className="rounded-lg border p-2">
            <p className="font-semibold text-yellow-600 mb-1">⭐ {t("unfairAdvantage")}</p>
            <p className="text-muted-foreground">{data.unfairAdvantage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const colorMap: Record<string, string> = {
  red: "text-red-600",
  green: "text-green-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
};

function Section({ title, items, color }: { title: string; items: string[] | undefined; color: string }) {
  return (
    <div className="rounded-lg border p-2">
      <p className={`font-semibold mb-1 ${colorMap[color]}`}>{title}</p>
      <ul className="space-y-0.5">
        {(items ?? []).map((item) => <li key={item} className="text-muted-foreground">• {item}</li>)}
      </ul>
    </div>
  );
}
