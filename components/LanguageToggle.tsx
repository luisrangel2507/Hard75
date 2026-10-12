"use client";

import { ChevronDown, Languages } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-black/25 backdrop-blur text-sm font-semibold text-white/85 hover:text-white transition"
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === "es" ? "ES" : "EN"}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}
