import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    .eq("status", "active")
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

      {!ideas || ideas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">{t("dashboard.noIdeas")}</p>
            <p className="text-sm text-muted-foreground">{t("dashboard.noIdeasHint")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/${locale}/idea/${idea.id}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{idea.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(idea.updated_at).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {t(`stages.${idea.stage}` as Parameters<typeof t>[0])}
                    </Badge>
                    {idea.score !== null && (
                      <span className="text-sm font-semibold">{idea.score}/100</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
