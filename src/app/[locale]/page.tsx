import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 text-center px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          {t("common.appName")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          {t("landing.subtitle")}
        </p>
        <Link href="/login">
          <Button size="lg" className="text-lg px-8">
            {t("landing.cta")}
          </Button>
        </Link>
      </main>
    </div>
  );
}
