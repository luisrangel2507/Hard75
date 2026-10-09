"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { t } = useI18n();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur-md border-b border-border/70 shadow-[0_1px_12px_rgba(40,33,26,0.04)]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/sun-logo.png" alt="75 Rise" width={80} height={80} className="h-10 w-auto shrink-0" priority />
          <span className="font-semibold tracking-widest text-sm text-ink hidden sm:inline whitespace-nowrap">
            75 <span className="text-brass">RISE</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={handleLogout}
            title={t("logout")}
            className="p-1.5 rounded-full text-muted hover:text-ember hover:bg-ember/10 active:scale-90 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
