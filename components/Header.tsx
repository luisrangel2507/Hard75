"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LineChart, LogOut, User } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navItem = (href: string, label: string, Icon: typeof LayoutGrid) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wide font-semibold transition active:scale-95 ${
          active
            ? "bg-gradient-to-r from-brass to-ember text-white shadow-[0_3px_8px_rgba(255,107,69,0.35)]"
            : "text-muted hover:text-ink"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur-md border-b border-border/70 shadow-[0_1px_12px_rgba(40,33,26,0.04)]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="75 Rise" width={63} height={42} className="h-[42px] w-auto rounded" priority />
          <span className="font-semibold tracking-widest text-sm text-ink hidden sm:inline">
            75 <span className="text-brass">RISE</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {navItem("/", t("dashboard"), LayoutGrid)}
          {navItem("/progress", t("progress"), LineChart)}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            title={t("profile")}
            className={`p-1.5 rounded-full transition active:scale-90 ${
              pathname === "/profile" ? "text-brass bg-brass/10" : "text-muted hover:text-ink hover:bg-border/40"
            }`}
          >
            <User className="h-4 w-4" />
          </Link>
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
