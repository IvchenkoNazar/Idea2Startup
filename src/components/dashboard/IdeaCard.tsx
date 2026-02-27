"use client";

import { useTransition, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Idea = {
  id: string;
  title: string;
  stage: string;
  score: number | null;
  status: string;
  updated_at: string;
};

type Props = {
  idea: Idea;
  locale: string;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function IdeaCard({ idea, locale, onArchive, onRestore, onDelete }: Props) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [showDelete, setShowDelete] = useState(false);

  function handleArchive(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(() => onArchive(idea.id));
  }

  function handleRestore(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(() => onRestore(idea.id));
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.preventDefault();
    setShowDelete(true);
  }

  function handleDeleteConfirm() {
    startTransition(() => onDelete(idea.id));
  }

  return (
    <>
      <div className="relative">
        <Link href={`/${locale}/idea/${idea.id}`}>
          <Card className={`hover:bg-accent transition-colors cursor-pointer ${isPending ? "opacity-50" : ""}`}>
            <CardContent className="flex items-center justify-between py-4 pr-12">
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

        {/* Kebab menu — sits outside Link to avoid nested <a> */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md"
                onClick={(e) => e.preventDefault()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {idea.status === "active" ? (
                <DropdownMenuItem onClick={handleArchive}>
                  {t("dashboard.archiveIdea")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleRestore}>
                  {t("dashboard.restoreIdea")}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive focus:text-destructive"
              >
                {t("dashboard.deleteIdea")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.deleteConfirmTitle", { title: idea.title })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.deleteConfirmBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("dashboard.deleteIdea")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
