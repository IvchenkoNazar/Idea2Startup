import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            {t("dashboard.noIdeas")}
          </p>
          <Button asChild>
            <Link href="/dashboard">+ {t("dashboard.newIdea")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
