# Landing Page Design — Idea2Startup

**Date:** 2026-02-27
**Status:** Approved

---

## Overview

A full single-scroll landing page for Idea2Startup. Target audience: both beginners (no startup experience) and experienced founders. Visual style: dark gradient (indigo → violet → black), modern AI SaaS aesthetic.

---

## Sections

### 1. Navbar
- Transparent with backdrop blur, becomes solid on scroll
- Left: Logo (SVG) + app name
- Right: locale switcher (EN | UK) + "Sign In" ghost button
- Fully responsive

### 2. Hero
- Full-viewport dark gradient background: `from-slate-950 via-indigo-950 to-violet-950`
- Small badge: "✨ AI-Powered Startup Validation"
- Large headline with gradient text: "Turn Your Idea Into a Validated Business Plan"
- Subtitle: 2-line description of what the product does
- Two CTAs: "Start for Free →" (primary) + "See how it works ↓" (ghost, scrolls to section 3)
- Trust bar: "6 stages · Real market data · EN + UA"

### 3. How It Works
- Title + subtitle
- 6 step cards in 2×3 grid connected by a progress line
- Each card: emoji icon + stage name + 1-line description
- Stages: Idea Capture → Market Research → Competitor Analysis → UVP → Lean Canvas → Score & Verdict
- Light muted background to separate from hero

### 4. Features
- Title: "Everything you need to validate"
- 2×3 grid of feature cards with border + hover effect
- Features: Real Market Data, AI-Powered Analysis, Live Dashboard, EN+UA Languages, Minutes not Months, Lean Canvas + Score

### 5. Product Mockup
- Title: "See it in action"
- Static HTML/CSS browser chrome mockup (dark, macOS-style dots)
- Shows split layout: chat on left, dashboard cards on right
- Caption: "This is the actual interface"
- Subtle dark gradient background

### 6. FAQ
- shadcn Accordion, 6 questions
- First item open by default
- Questions: free?, accuracy?, AI model?, multiple ideas?, privacy?, technical knowledge needed?

### 7. Footer CTA + Footer
- Dark gradient (matches hero) with headline + single CTA button
- Simple footer: logo, copyright, locale switcher

---

## Technical Notes

- Single file: `src/app/[locale]/page.tsx` (Server Component, uses `getTranslations`)
- All text via `en.json` / `uk.json` under `"landing"` namespace
- No new dependencies — use existing shadcn Accordion
- Responsive: mobile-first, grid collapses to 1 column on small screens
- Navbar scroll effect via `"use client"` wrapper component
