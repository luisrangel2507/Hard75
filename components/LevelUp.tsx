"use client";

import { useEffect } from "react";
import { Zap } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { titleForLevel } from "@/lib/game";

export function LevelUp({ level, onClose }: { level: number; onClose: () => void }) {
  const { lang } = useI18n();
  const es = lang === "es";

  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="w-full max-w-xs rounded-3xl bg-card p-7 flex flex-col items-center gap-3 text-center shadow-xl">
        <span className="h-14 w-14 rounded-full bg-brass text-white flex items-center justify-center">
          <Zap className="h-7 w-7" />
        </span>
        <p className="label-caps">{es ? "¡Subiste de nivel!" : "Level up!"}</p>
        <p className="num text-6xl font-bold text-ink leading-none">{level}</p>
        <p className="text-lg font-semibold text-brass">{titleForLevel(level, lang)}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-xl bg-brass text-white font-semibold text-sm py-3 active:scale-[0.97] transition"
        >
          {es ? "Seguir" : "Keep going"}
        </button>
      </div>
    </div>
  );
}
