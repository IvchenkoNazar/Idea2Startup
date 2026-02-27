# Dashboard Polish — Batch 1 Design

**Goal:** Add toast notifications, idea count badges on tabs, and sort functionality to the dashboard.

**Batch scope:** 3 features (quick wins). Batch 2 (search/filter, bulk actions) and Batch 3 (share, export, onboarding) to follow.

---

## 1. Toast Notifications

**Library:** shadcn Sonner integration.

**Setup:** Add `<Toaster />` to root layout (`src/app/[locale]/layout.tsx`).

**Triggers (in IdeaCard):**
- Archive success → `toast("Idea archived")` / `toast("Ідею архівовано")`
- Restore success → `toast("Idea restored")` / `toast("Ідею відновлено")`
- Delete success → `toast("Idea deleted")` / `toast("Ідею видалено")`

**No undo button** — archive is reversible via Restore tab, delete is already confirmed by AlertDialog.

**Translation keys needed:** `dashboard.toastArchived`, `dashboard.toastRestored`, `dashboard.toastDeleted`

## 2. Idea Count Badges on Tabs

**Location:** `DashboardTabs` component.

**Display:** Tab label becomes `Active (3)` / `Archived (1)`.

**Data:** Count derived from `ideas.filter(i => i.status === key).length` — no extra DB queries.

## 3. Sort Ideas

**Location:** Sort dropdown above the idea list inside `DashboardTabs`.

**Options:**
- "Last updated" (default) — `updated_at` descending
- "Score" — `score` descending, nulls last

**Implementation:** Client-side sort with `useState` in `DashboardTabs`. Sort applies independently per tab.

**UI:** Small dropdown using shadcn `DropdownMenu` or a simple `<select>`, positioned right-aligned above the idea grid.

**Translation keys needed:** `dashboard.sortByDate`, `dashboard.sortByScore`
