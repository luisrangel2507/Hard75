"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LineChart, LogOut } from "lucide-react";
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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs uppercase tracking-wide font-semibold transition ${
          active ? "bg-brass/15 text-brass border border-brass/40" : "text-muted hover:text-ink"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="font-semibold tracking-widest text-sm text-ink">
          FIT<span className="text-brass">FOR75</span>
        </Link>
        <nav className="flex items-center gap-2">
          {navItem("/", t("dashboard"), LayoutGrid)}
          {navItem("/progress", t("progress"), LineChart)}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={handleLogout}
            title={t("logout")}
            className="p-1.5 rounded-md text-muted hover:text-ember transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
