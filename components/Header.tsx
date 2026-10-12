"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-20 h-14 transition-colors ${
        overlay && !scrolled ? "-mb-14 bg-transparent" : "bg-bg/90 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-game text-3xl italic text-white leading-none">75</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 -ml-1" aria-hidden>
            <defs>
              <linearGradient id="hdr-sun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFC24D" />
                <stop offset="1" stopColor="#FF5A1F" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#hdr-sun)" />
            <path d="M3 14h18M4.5 17.5h15M7 21h10" stroke="#0A1020" strokeWidth="1.4" />
          </svg>
          <span className="font-game text-[13px] text-brass hidden sm:inline whitespace-nowrap">
            RISE
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
