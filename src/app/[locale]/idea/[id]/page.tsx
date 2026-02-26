import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceClient } from "./WorkspaceClient";
import type { Message } from "@/types/chat";

export default async function IdeaWorkspacePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const supabase = await createClient();

  const [{ data: idea }, { data: messages }] = await Promise.all([
    supabase.from("ideas").select("*").eq("id", id).single(),
    supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("idea_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!idea) notFound();

  const initialMessages: Message[] = (messages ?? []).map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    createdAt: new Date(m.created_at),
  }));

  return (
    <WorkspaceClient
      ideaId={id}
      locale={locale}
      ideaTitle={idea.title}
      initialMessages={initialMessages}
    />
  );
}
