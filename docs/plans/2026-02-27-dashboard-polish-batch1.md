# Dashboard Polish Batch 1 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add toast notifications after archive/restore/delete, idea count badges on tabs, and sort-by-date/score to the dashboard.

**Architecture:** Install shadcn Sonner for toasts, add `<Toaster />` to root layout. Extend `IdeaCard` callbacks to show toasts on success. Add count badges and sort dropdown to `DashboardTabs`. All changes are client-side except the Sonner setup in layout.

**Tech Stack:** shadcn Sonner, next-intl, existing DashboardTabs + IdeaCard components

---

### Task 1: Add translations

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/uk.json`

**Step 1: Add keys to `en.json` under `"dashboard"`**

After `"noArchivedIdeasHint"`, add:

```json
"toastArchived": "Idea archived",
"toastRestored": "Idea restored",
"toastDeleted": "Idea deleted",
"sortByDate": "Last updated",
"sortByScore": "Score"
```

**Step 2: Add same keys to `uk.json` under `"dashboard"`**

```json
"toastArchived": "Ідею архівовано",
"toastRestored": "Ідею відновлено",
"toastDeleted": "Ідею видалено",
"sortByDate": "Останнє оновлення",
"sortByScore": "Оцінка"
```

**Step 3: Commit**

```bash
git add src/messages/en.json src/messages/uk.json
git commit -m "feat: add toast and sort translations"
```

---

### Task 2: Install Sonner and add Toaster to layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Install shadcn sonner**

Run: `npx shadcn@latest add sonner -y`

This creates `src/components/ui/sonner.tsx` and installs the `sonner` package.

**Step 2: Add `<Toaster />` to root layout**

Open `src/app/[locale]/layout.tsx`. Add import and component:

```tsx
import { Toaster } from "@/components/ui/sonner";
```

Place `<Toaster />` right after `{children}` inside `<NextIntlClientProvider>`:

```tsx
<NextIntlClientProvider locale={locale}>
  {children}
  <Toaster />
</NextIntlClientProvider>
```

**Step 3: Verify build compiles**

Run: `npx next build 2>&1 | grep -E "(error|Error|✓|✗|Compiled)"`
Expected: `✓ Compiled successfully`

**Step 4: Commit**

```bash
git add src/components/ui/sonner.tsx src/app/[locale]/layout.tsx package.json
git commit -m "feat: install sonner and add Toaster to layout"
```

---

### Task 3: Add toast notifications to IdeaCard

**Files:**
- Modify: `src/components/dashboard/IdeaCard.tsx`

**Step 1: Add toast import and call toasts after actions**

Add import at top:

```tsx
import { toast } from "sonner";
```

Modify the three handlers to call `toast()` after the action completes. Replace the handler functions:

```tsx
function handleArchive(e: React.MouseEvent) {
  e.preventDefault();
  startTransition(async () => {
    await onArchive(idea.id);
    toast(t("dashboard.toastArchived"));
  });
}

function handleRestore(e: React.MouseEvent) {
  e.preventDefault();
  startTransition(async () => {
    await onRestore(idea.id);
    toast(t("dashboard.toastRestored"));
  });
}

function handleDeleteConfirm() {
  startTransition(async () => {
    await onDelete(idea.id);
    toast(t("dashboard.toastDeleted"));
  });
}
```

Note: `handleDeleteClick` stays the same — it just opens the dialog.

**Step 2: Verify build compiles**

Run: `npx next build 2>&1 | grep -E "(error|Error|✓|✗|Compiled)"`
Expected: `✓ Compiled successfully`

**Step 3: Commit**

```bash
git add src/components/dashboard/IdeaCard.tsx
git commit -m "feat: show toast after archive/restore/delete"
```

---

### Task 4: Add count badges and sort dropdown to DashboardTabs

**Files:**
- Modify: `src/components/dashboard/DashboardTabs.tsx`

**Step 1: Add sort state and count badges**

Replace the entire `DashboardTabs.tsx` with:

```tsx
"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { IdeaCard } from "./IdeaCard";
import { cn } from "@/lib/utils";

type Idea = {
  id: string;
  title: string;
  stage: string;
  score: number | null;
  status: string;
  updated_at: string;
};

type Props = {
  ideas: Idea[];
  locale: string;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type SortKey = "date" | "score";

export function DashboardTabs({ ideas, locale, onArchive, onRestore, onDelete }: Props) {
  const t = useTranslations("dashboard");
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [sort, setSort] = useState<SortKey>("date");

  const activeCount = ideas.filter((i) => i.status === "active").length;
  const archivedCount = ideas.filter((i) => i.status === "archived").length;
  const counts = { active: activeCount, archived: archivedCount };

  const filtered = useMemo(() => {
    const byStatus = ideas.filter((i) => i.status === tab);
    if (sort === "score") {
      return [...byStatus].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    }
    return byStatus; // already sorted by updated_at from server
  }, [ideas, tab, sort]);

  return (
    <div>
      {/* Tabs + Sort */}
      <div className="flex items-center justify-between mb-4 border-b border-border">
        <div className="flex gap-1">
          {(["active", "archived"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                tab === key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t(key)} ({counts[key]})
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-xs text-muted-foreground bg-transparent border-none outline-none cursor-pointer -mb-px"
        >
          <option value="date">{t("sortByDate")}</option>
          <option value="score">{t("sortByScore")}</option>
        </select>
      </div>

      {/* Idea list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">
              {tab === "active" ? t("noIdeas") : t("noArchivedIdeas")}
            </p>
            <p className="text-sm text-muted-foreground">
              {tab === "active" ? t("noIdeasHint") : t("noArchivedIdeasHint")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              locale={locale}
              onArchive={onArchive}
              onRestore={onRestore}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify build compiles**

Run: `npx next build 2>&1 | grep -E "(error|Error|✓|✗|Compiled)"`
Expected: `✓ Compiled successfully`

**Step 3: Manual test**

Run: `npx next dev`
Open: `http://localhost:3000/en/dashboard`

Expected:
- Tabs show counts: "Active (N)" / "Archived (M)"
- Sort dropdown in top-right: "Last updated" / "Score"
- Switching sort reorders cards
- Archive an idea → toast "Idea archived" appears, counts update
- Restore → toast "Idea restored", counts update
- Delete → confirmation dialog → toast "Idea deleted", counts update

**Step 4: Commit**

```bash
git add src/components/dashboard/DashboardTabs.tsx
git commit -m "feat: add count badges and sort dropdown to dashboard tabs"
```
