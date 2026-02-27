import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

      {/* MOCKUP */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t("mockupTitle")}</h2>
            <p className="text-white/60">{t("mockupSubtitle")}</p>
          </div>

          {/* Browser chrome */}
          <div className="rounded-xl border border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden">
            {/* Browser top bar */}
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-3 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4 rounded-md bg-slate-700 h-6 flex items-center px-3">
                <span className="text-xs text-white/40">idea2startup.com/idea/...</span>
              </div>
            </div>

            {/* App mockup */}
            <div className="flex bg-slate-900 h-80">
              {/* Chat side */}
              <div className="flex-1 border-r border-white/10 p-4 flex flex-col gap-3">
                <div className="text-xs text-white/30 font-medium uppercase tracking-wide mb-2">Chat</div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-indigo-600/80 px-3 py-2 text-xs text-white">
                  I want to build an AI fitness coaching app
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-xs text-white/80">
                  Great idea! I found 4 competitors. Freeletics and Fitbod are the main ones, but none offer real-time form correction...
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-indigo-600/80 px-3 py-2 text-xs text-white">
                  What&apos;s my overall score?
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-xs text-white/80">
                  Your idea scores <span className="text-green-400 font-bold">74/100</span> — strong market fit with a clear gap...
                </div>
              </div>

              {/* Dashboard side */}
              <div className="w-56 p-3 flex flex-col gap-2 overflow-hidden">
                <div className="text-xs text-white/30 font-medium uppercase tracking-wide mb-1">Live Dashboard</div>
                {[
                  { icon: "💡", label: "Idea Summary", color: "border-indigo-500/30" },
                  { icon: "🔍", label: "Competitors · 4", color: "border-blue-500/30" },
                  { icon: "💎", label: "UVP", color: "border-violet-500/30" },
                  { icon: "📊", label: "Score · 74/100", color: "border-green-500/30" },
                ].map((card) => (
                  <div key={card.label} className={`rounded-lg border ${card.color} bg-white/5 px-2.5 py-2`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{card.icon}</span>
                      <span className="text-xs text-white/70 font-medium">{card.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-white/30 mt-4">{t("mockupCaption")}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">{t("faqTitle")}</h2>

          <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-2">
            {[
              { q: t("faq1Q"), a: t("faq1A") },
              { q: t("faq2Q"), a: t("faq2A") },
              { q: t("faq3Q"), a: t("faq3A") },
              { q: t("faq4Q"), a: t("faq4A") },
              { q: t("faq5Q"), a: t("faq5A") },
              { q: t("faq6Q"), a: t("faq6A") },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 data-[state=open]:bg-white/8 data-[state=open]:border-indigo-500/30 transition-all"
              >
                <AccordionTrigger className="text-white hover:no-underline hover:text-indigo-300 text-left py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 pb-4 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
