import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default async function Home() {
  const t = await getTranslations("landing");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950" />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/80 mb-8 backdrop-blur">
            {t("heroBadge")}
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            {t("heroTitle1")}{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {t("heroTitle2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="text-base px-8 bg-indigo-600 hover:bg-indigo-500 text-white border-0">
              <Link href="/login">{t("heroCta")}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-base text-white/70 hover:text-white hover:bg-white/10">
              <a href="#how-it-works">{t("heroCtaSecondary")}</a>
            </Button>
          </div>

          {/* Trust bar */}
          <p className="text-sm text-white/40 tracking-wide">{t("heroTrust")}</p>
        </div>
      </section>
    </div>
  );
}
