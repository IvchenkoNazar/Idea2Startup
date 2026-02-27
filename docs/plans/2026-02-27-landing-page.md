# Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full single-scroll landing page with dark gradient hero, 6 sections, and EN+UA translations.

**Architecture:** Single `src/app/[locale]/page.tsx` Server Component with a `LandingNavbar` client component (for scroll effect). All text via `next-intl`. No new dependencies except shadcn Accordion.

**Tech Stack:** Next.js App Router, shadcn/ui, Tailwind CSS, next-intl, shadcn Accordion (new)

---

### Task 1: Install shadcn Accordion + add all translations

**Files:**
- Modify: `src/messages/en.json` — add landing namespace
- Modify: `src/messages/uk.json` — add landing namespace

**Step 1: Install Accordion component**

```bash
npx shadcn@latest add accordion
```

Expected: creates `src/components/ui/accordion.tsx`

**Step 2: Replace `landing` namespace in `src/messages/en.json`**

Replace the existing `"landing"` block with:

```json
"landing": {
  "navSignIn": "Sign In",
  "heroBadge": "✨ AI-Powered Startup Validation",
  "heroTitle1": "Turn Your Idea Into a",
  "heroTitle2": "Validated Business Plan",
  "heroSubtitle": "AI guides you through market research, competitor analysis and business model — in minutes, not months.",
  "heroCta": "Start for Free →",
  "heroCtaSecondary": "See how it works ↓",
  "heroTrust": "6 stages · Real market data · EN + UA",
  "howTitle": "How It Works",
  "howSubtitle": "From idea to business plan in 6 guided steps",
  "step1Title": "Idea Capture",
  "step1Desc": "Describe your idea, AI clarifies and structures it",
  "step2Title": "Market Research",
  "step2Desc": "AI searches the web and Product Hunt for market data",
  "step3Title": "Competitor Analysis",
  "step3Desc": "Find gaps and weaknesses in existing solutions",
  "step4Title": "UVP",
  "step4Desc": "Define what makes your solution unique",
  "step5Title": "Lean Canvas",
  "step5Desc": "Build your one-page business model",
  "step6Title": "Score & Verdict",
  "step6Desc": "Get a 0–100 score with actionable recommendations",
  "featuresTitle": "Everything you need to validate",
  "feature1Title": "Real Market Data",
  "feature1Desc": "Web search + Product Hunt give you actual competitor and trend data, not AI guesses.",
  "feature2Title": "AI-Powered Analysis",
  "feature2Desc": "Claude AI gives you an honest, structured verdict on your idea's potential.",
  "feature3Title": "Live Dashboard",
  "feature3Desc": "Cards populate in real-time as AI analyses your idea — no waiting for a final report.",
  "feature4Title": "EN + UA Languages",
  "feature4Desc": "Full interface and AI responses in English and Ukrainian.",
  "feature5Title": "Minutes, Not Months",
  "feature5Desc": "Complete validation in one focused session instead of weeks of manual research.",
  "feature6Title": "Lean Canvas + Score",
  "feature6Desc": "Walk away with a ready business model and a clear score you can share.",
  "mockupTitle": "See it in action",
  "mockupSubtitle": "Real output for a real idea",
  "mockupCaption": "This is the actual interface — not a marketing mockup.",
  "faqTitle": "Frequently Asked Questions",
  "faq1Q": "Is it free to use?",
  "faq1A": "Yes, completely free during the beta period. No credit card required.",
  "faq2Q": "How accurate is the market research?",
  "faq2A": "AI uses live web search and Product Hunt data. Results reflect real market conditions, though we always recommend validating further with actual user interviews.",
  "faq3Q": "What AI model powers this?",
  "faq3A": "Claude (Anthropic) via AWS Bedrock — one of the most capable and honest AI models available.",
  "faq4Q": "Can I validate multiple ideas?",
  "faq4A": "Yes. Each idea gets its own workspace with full chat history and dashboard. Create as many as you need.",
  "faq5Q": "Is my idea kept private?",
  "faq5A": "Yes. Your ideas are stored securely and are only accessible to your account. We never use your data to train AI models.",
  "faq6Q": "Do I need technical knowledge?",
  "faq6A": "No. Just describe your idea in plain language. The platform is designed for both first-time founders and experienced entrepreneurs.",
  "ctaTitle": "Ready to validate your idea?",
  "ctaSubtitle": "Join founders who stopped guessing.",
  "ctaButton": "Start for Free →",
  "footerMade": "Made with ❤️ in Ukraine",
  "footerCopy": "© 2026 Idea2Startup"
}
```

**Step 3: Replace `landing` namespace in `src/messages/uk.json`**

```json
"landing": {
  "navSignIn": "Увійти",
  "heroBadge": "✨ AI-валідація стартапів",
  "heroTitle1": "Перетворіть вашу ідею на",
  "heroTitle2": "Перевірений бізнес-план",
  "heroSubtitle": "AI проведе вас через дослідження ринку, аналіз конкурентів і бізнес-модель — за хвилини, а не місяці.",
  "heroCta": "Почати безкоштовно →",
  "heroCtaSecondary": "Як це працює ↓",
  "heroTrust": "6 етапів · Реальні дані ринку · EN + UA",
  "howTitle": "Як це працює",
  "howSubtitle": "Від ідеї до бізнес-плану за 6 кроків",
  "step1Title": "Захоплення ідеї",
  "step1Desc": "Опишіть ідею, AI структурує та уточнює її",
  "step2Title": "Дослідження ринку",
  "step2Desc": "AI шукає ринкові дані в інтернеті та Product Hunt",
  "step3Title": "Аналіз конкурентів",
  "step3Desc": "Знаходить слабкі місця існуючих рішень",
  "step4Title": "УЦП",
  "step4Desc": "Визначте, чим ваше рішення є унікальним",
  "step5Title": "Lean Canvas",
  "step5Desc": "Побудуйте одосторінкову бізнес-модель",
  "step6Title": "Оцінка і вердикт",
  "step6Desc": "Отримайте оцінку 0–100 з конкретними рекомендаціями",
  "featuresTitle": "Все, що потрібно для валідації",
  "feature1Title": "Реальні дані ринку",
  "feature1Desc": "Веб-пошук і Product Hunt дають актуальні дані про конкурентів і тренди.",
  "feature2Title": "AI-аналіз",
  "feature2Desc": "Claude AI дає чесний структурований вердикт щодо потенціалу вашої ідеї.",
  "feature3Title": "Live Dashboard",
  "feature3Desc": "Картки з'являються в реальному часі поки AI аналізує вашу ідею.",
  "feature4Title": "EN + UA мови",
  "feature4Desc": "Повний інтерфейс і відповіді AI українською та англійською.",
  "feature5Title": "Хвилини, а не місяці",
  "feature5Desc": "Повна валідація за одну сесію замість тижнів ручного дослідження.",
  "feature6Title": "Lean Canvas + Оцінка",
  "feature6Desc": "Виходьте з готовою бізнес-моделлю та чіткою оцінкою для шерингу.",
  "mockupTitle": "Дивіться в дії",
  "mockupSubtitle": "Реальний результат для реальної ідеї",
  "mockupCaption": "Це реальний інтерфейс — не маркетинговий мокап.",
  "faqTitle": "Часті запитання",
  "faq1Q": "Це безкоштовно?",
  "faq1A": "Так, повністю безкоштовно в бета-версії. Картка не потрібна.",
  "faq2Q": "Наскільки точне дослідження ринку?",
  "faq2A": "AI використовує живий веб-пошук і дані Product Hunt. Рекомендуємо також провести інтерв'ю з користувачами.",
  "faq3Q": "Яка AI-модель використовується?",
  "faq3A": "Claude (Anthropic) через AWS Bedrock — одна з найкращих та найчесніших AI-моделей.",
  "faq4Q": "Можна валідувати кілька ідей?",
  "faq4A": "Так. Кожна ідея має власний воркспейс з історією чату і дашбордом.",
  "faq5Q": "Моя ідея залишається приватною?",
  "faq5A": "Так. Ідеї зберігаються безпечно і доступні тільки вашому акаунту. Ми не використовуємо дані для навчання AI.",
  "faq6Q": "Потрібні технічні знання?",
  "faq6A": "Ні. Просто опишіть ідею звичайною мовою. Платформа розроблена і для початківців, і для досвідчених засновників.",
  "ctaTitle": "Готові валідувати свою ідею?",
  "ctaSubtitle": "Приєднуйтесь до засновників, які перестали гадати.",
  "ctaButton": "Почати безкоштовно →",
  "footerMade": "Зроблено з ❤️ в Україні",
  "footerCopy": "© 2026 Idea2Startup"
}
```

**Step 4: Commit**

```bash
git add src/messages/en.json src/messages/uk.json src/components/ui/accordion.tsx
git commit -m "feat: add landing page translations + accordion component"
```

---

### Task 2: LandingNavbar client component

**Files:**
- Create: `src/components/landing/LandingNavbar.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const t = useTranslations("landing");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const currentLocale = pathname.split("/")[1];
  const otherLocale = currentLocale === "uk" ? "en" : "uk";
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-slate-950/90 backdrop-blur border-b border-white/10 shadow-lg"
        : "bg-transparent"
    )}>
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Idea2Startup" width={28} height={28} />
          <span className="font-bold text-white text-lg">Idea2Startup</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/${otherLocale}${pathWithoutLocale}`}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <Button asChild size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
            <Link href="/login">{t("navSignIn")}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/LandingNavbar.tsx
git commit -m "feat: add LandingNavbar with scroll effect"
```

---

### Task 3: Hero section

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Replace page.tsx with Hero + Navbar**

```tsx
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
```

**Step 2: Visit http://localhost:5001 — verify dark hero with gradient, badge, headline, two buttons**

**Step 3: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: landing page hero section"
```

---

### Task 4: How It Works section

**Files:**
- Modify: `src/app/[locale]/page.tsx` — add section after Hero inside the outer div

**Step 1: Add the section after the closing `</section>` of Hero**

```tsx
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
```

**Step 2: Verify 6 cards in 3-column grid at http://localhost:5001**

**Step 3: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: landing page how-it-works section"
```

---

### Task 5: Features section

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Add after How It Works section**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: landing page features section"
```

---

### Task 6: Product Mockup section

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Add after Features section**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: landing page product mockup section"
```

---

### Task 7: FAQ section

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Add Accordion import at top of file**

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
```

**Step 2: Add FAQ section after Mockup**

```tsx
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
```

**Step 3: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: landing page FAQ section"
```

---

### Task 8: Footer CTA + Footer

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Add final sections after FAQ, before closing `</div>`**

```tsx
      {/* FOOTER CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t("ctaTitle")}</h2>
          <p className="text-white/60 text-lg mb-8">{t("ctaSubtitle")}</p>
          <Button asChild size="lg" className="text-base px-10 bg-indigo-600 hover:bg-indigo-500 text-white border-0">
            <Link href="/login">{t("ctaButton")}</Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Idea2Startup" width={20} height={20} />
            <span>{t("footerCopy")}</span>
          </div>
          <span>{t("footerMade")}</span>
        </div>
      </footer>
```

**Step 2: Add `Image` import at top (already used in Navbar but page.tsx needs it too)**

```tsx
import Image from "next/image";
```

**Step 3: Verify full page at http://localhost:5001 — scroll through all 7 sections**

**Step 4: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: landing page footer CTA and footer"
```

---

### Task 9: Final push

**Step 1: Push to remote**

```bash
git push origin master
```
