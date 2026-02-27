import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [supabase, t] = await Promise.all([
    createClient(),
    getTranslations({ locale }),
  ]);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: ideas } = await supabase
    .from("ideas")
    .select("*")
    .in("status", ["active", "archived"])
    .order("updated_at", { ascending: false });

  async function createIdea(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const title = formData.get("title") as string;
    if (!title?.trim()) return;
    const { data: idea } = await supabase
      .from("ideas")
      .insert({ title: title.trim(), user_id: user.id })
      .select("id")
      .single();
    if (idea) {
      revalidatePath(`/${locale}/dashboard`);
      redirect(`/${locale}/idea/${idea.id}`);
    }
  }

  async function archiveIdea(id: string) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("ideas").update({ status: "archived" }).eq("id", id).eq("user_id", user.id);
    revalidatePath(`/${locale}/dashboard`);
  }

  async function restoreIdea(id: string) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("ideas").update({ status: "active" }).eq("id", id).eq("user_id", user.id);
    revalidatePath(`/${locale}/dashboard`);
  }

  async function deleteIdea(id: string) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("ideas").delete().eq("id", id).eq("user_id", user.id);
    revalidatePath(`/${locale}/dashboard`);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
      </div>

      <form action={createIdea} className="flex gap-2 mb-8">
        <input
          name="title"
          placeholder={t("dashboard.newIdeaPlaceholder")}
          className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          required
        />
        <Button type="submit" className="rounded-xl">
          + {t("dashboard.newIdea")}
        </Button>
      </form>

      <DashboardTabs
        ideas={ideas ?? []}
        locale={locale}
        onArchive={archiveIdea}
        onRestore={restoreIdea}
        onDelete={deleteIdea}
      />
    </div>
  );
}
