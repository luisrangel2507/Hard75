"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, LineChart, LogOut, Menu, User, X } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [streak, setStreak] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const bigLogoPage = pathname.startsWith("/day/");
  const overlay = pathname === "/" || bigLogoPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    fetch("/api/streak", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setStreak(Number(d.streak) || 0))
      .catch(() => {});
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const glass = "h-10 rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 text-white";

  return (
    <header
      className={`sticky top-0 z-20 h-14 transition-colors ${
        overlay && !scrolled ? "-mb-14 bg-transparent" : "bg-bg/90 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3 relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className={`${glass} w-12 flex items-center justify-center active:scale-90 transition`}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          href="/"
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-1 transition-opacity ${
            bigLogoPage && !scrolled ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <span className="font-game text-3xl italic text-white leading-none">75</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <defs>
              <linearGradient id="hdr-sun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFC24D" />
                <stop offset="1" stopColor="#FF5A1F" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#hdr-sun)" />
            <path d="M3 14h18M4.5 17.5h15M7 21h10" stroke="#0A1020" strokeWidth="1.4" />
          </svg>
        </Link>

        <div className={`${glass} px-3.5 flex items-center gap-2`} aria-label={t("streak")}>
          <Flame className="h-5 w-5 text-brass" />
          <span className="font-game text-xl leading-none">{streak}</span>
        </div>

        {menuOpen && (
          <div className="absolute left-4 top-[52px] w-60 rounded-2xl border border-border bg-panel/95 backdrop-blur-md p-2 shadow-xl flex flex-col gap-1 animate-fade-in">
            <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-white/5">
              <User className="h-4 w-4 text-muted" />
              {t("profile")}
            </Link>
            <Link href="/progress" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-white/5">
              <LineChart className="h-4 w-4 text-muted" />
              {t("progress")}
            </Link>
            <div className="px-2 py-1.5">
              <LanguageToggle />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ember hover:bg-white/5 text-left"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
