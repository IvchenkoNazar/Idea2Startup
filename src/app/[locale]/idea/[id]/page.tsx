import { useTranslations } from "next-intl";

export default function IdeaWorkspacePage() {
  const t = useTranslations();

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">
        {t("workspace.chatPlaceholder")}
      </p>
    </div>
  );
}
