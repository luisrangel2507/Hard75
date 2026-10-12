"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const bigLogoPage = pathname.startsWith("/day/");
  const overlay = pathname === "/" || bigLogoPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 h-14 transition-colors ${
        overlay && !scrolled ? "-mb-14 bg-transparent" : "bg-bg/90 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className={`flex items-center gap-2 transition-opacity ${bigLogoPage && !scrolled ? "opacity-0 pointer-events-none" : ""}`}>
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
          <Link
            href="/progress"
            title={t("progress")}
            className="h-9 w-9 rounded-xl border border-border bg-black/25 backdrop-blur flex items-center justify-center text-white/85 hover:text-white active:scale-90 transition"
          >
            <CalendarCheck className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
