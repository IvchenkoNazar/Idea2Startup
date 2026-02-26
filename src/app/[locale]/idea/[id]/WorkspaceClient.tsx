"use client";

import { useState } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Message, ArtifactUpdate } from "@/types/chat";

type Props = {
  ideaId: string;
  locale: string;
  ideaTitle?: string;
  initialMessages: Message[];
};

export function WorkspaceClient({ ideaId, locale, ideaTitle, initialMessages }: Props) {
  const [artifacts, setArtifacts] = useState<Record<string, ArtifactUpdate>>({});

  function handleArtifact(artifact: ArtifactUpdate) {
    setArtifacts((prev) => ({ ...prev, [artifact.type]: artifact }));
  }

  return (
    <div className="h-screen">
      <ChatWindow
        ideaId={ideaId}
        locale={locale}
        ideaTitle={ideaTitle}
        initialMessages={initialMessages}
        onArtifact={handleArtifact}
      />
    </div>
  );
}
