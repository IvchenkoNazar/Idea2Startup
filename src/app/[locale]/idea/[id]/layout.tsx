import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";

export default async function IdeaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ideas } = await supabase
    .from("ideas")
    .select("id, title, stage, score")
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  return (
    <AppShell
      user={user ? { email: user.email, name: user.user_metadata?.full_name } : null}
      ideas={ideas ?? []}
    >
      {children}
    </AppShell>
  );
}
