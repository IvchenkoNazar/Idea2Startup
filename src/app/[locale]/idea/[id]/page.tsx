import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceClient } from "./WorkspaceClient";
import type { Message, ArtifactUpdate } from "@/types/chat";

export default async function IdeaWorkspacePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const supabase = await createClient();

  const [{ data: idea }, { data: messages }, { data: artifacts }] = await Promise.all([
    supabase.from("ideas").select("*").eq("id", id).single(),
    supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("idea_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("artifacts")
      .select("type, data")
      .eq("idea_id", id),
  ]);

  if (!idea) notFound();

  const initialMessages: Message[] = (messages ?? []).map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    createdAt: new Date(m.created_at),
  }));

  const initialArtifacts: Record<string, ArtifactUpdate> = {};
  for (const a of artifacts ?? []) {
    initialArtifacts[a.type] = { type: a.type, data: a.data as Record<string, unknown> };
  }

  return (
    <WorkspaceClient
      ideaId={id}
      locale={locale}
      ideaTitle={idea.title}
      initialMessages={initialMessages}
      initialArtifacts={initialArtifacts}
    />
  );
}
