"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border text-xs uppercase tracking-wide font-semibold text-muted hover:text-ink hover:border-brass/50 transition"
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === "es" ? "ES" : "EN"}
    </button>
  );
}
