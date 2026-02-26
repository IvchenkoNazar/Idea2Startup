"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { LiveDashboard } from "@/components/dashboard/LiveDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Message, ArtifactUpdate } from "@/types/chat";

type Props = {
  ideaId: string;
  locale: string;
  ideaTitle?: string;
  initialMessages: Message[];
  initialArtifacts?: Record<string, ArtifactUpdate>;
};

export function WorkspaceClient({
  ideaId,
  locale,
  ideaTitle,
  initialMessages,
  initialArtifacts = {},
}: Props) {
  const t = useTranslations("artifacts");
  const [artifacts, setArtifacts] = useState<Record<string, ArtifactUpdate>>(initialArtifacts);

  function handleArtifact(artifact: ArtifactUpdate) {
    setArtifacts((prev) => ({ ...prev, [artifact.type]: artifact }));
  }

  const hasArtifacts = Object.keys(artifacts).length > 0;

  return (
    <>
      {/* Desktop: split view */}
      <div className="hidden md:flex h-screen">
        <div className="flex-1 min-w-0">
          <ChatWindow
            ideaId={ideaId}
            locale={locale}
            ideaTitle={ideaTitle}
            initialMessages={initialMessages}
            onArtifact={handleArtifact}
          />
        </div>
        <div className="w-[380px] shrink-0">
          <LiveDashboard artifacts={artifacts} />
        </div>
      </div>

      {/* Mobile: tabs */}
      <div className="flex md:hidden h-screen flex-col">
        <Tabs defaultValue="chat" className="flex flex-col flex-1">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="chat" className="flex-1">{t("mobileChat")}</TabsTrigger>
            <TabsTrigger value="dashboard" className="flex-1">
              {t("mobileDashboard")}
              {hasArtifacts && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {Object.keys(artifacts).length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
            <ChatWindow
              ideaId={ideaId}
              locale={locale}
              ideaTitle={ideaTitle}
              initialMessages={initialMessages}
              onArtifact={handleArtifact}
            />
          </TabsContent>
          <TabsContent value="dashboard" className="flex-1 mt-0 overflow-hidden">
            <LiveDashboard artifacts={artifacts} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
