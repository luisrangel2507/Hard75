"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { dictionary, DictKey } from "@/lib/i18n";
import { Lang } from "@/lib/types";

interface I18nContextValue {
  lang: Lang;
  t: (key: DictKey) => string;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.cookie = `ff75_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: next }),
    }).catch(() => {});
  }, []);

  const t = useCallback((key: DictKey) => dictionary[lang][key] ?? dictionary.es[key], [lang]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
