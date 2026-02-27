"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const t = useTranslations("landing");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const currentLocale = pathname.split("/")[1];
  const otherLocale = currentLocale === "uk" ? "en" : "uk";
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-slate-950/90 backdrop-blur border-b border-white/10 shadow-lg"
        : "bg-transparent"
    )}>
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Idea2Startup" width={28} height={28} />
          <span className="font-bold text-white text-lg">Idea2Startup</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/${otherLocale}${pathWithoutLocale}`}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <Button asChild size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
            <Link href="/login">{t("navSignIn")}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
