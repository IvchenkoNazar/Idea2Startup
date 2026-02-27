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

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("howTitle")}</h2>
            <p className="text-white/60 text-lg">{t("howSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "💡", num: 1, title: t("step1Title"), desc: t("step1Desc") },
              { icon: "🔍", num: 2, title: t("step2Title"), desc: t("step2Desc") },
              { icon: "🏆", num: 3, title: t("step3Title"), desc: t("step3Desc") },
              { icon: "💎", num: 4, title: t("step4Title"), desc: t("step4Desc") },
              { icon: "📋", num: 5, title: t("step5Title"), desc: t("step5Desc") },
              { icon: "📊", num: 6, title: t("step6Title"), desc: t("step6Desc") },
            ].map((step) => (
              <div key={step.num} className="relative rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/8 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">{step.num}</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-white/50">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("featuresTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔍", title: t("feature1Title"), desc: t("feature1Desc") },
              { icon: "🤖", title: t("feature2Title"), desc: t("feature2Desc") },
              { icon: "📊", title: t("feature3Title"), desc: t("feature3Desc") },
              { icon: "🌍", title: t("feature4Title"), desc: t("feature4Desc") },
              { icon: "⚡", title: t("feature5Title"), desc: t("feature5Desc") },
              { icon: "📋", title: t("feature6Title"), desc: t("feature6Desc") },
            ].map((f, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 hover:border-indigo-500/40 hover:from-indigo-500/10 transition-all group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
