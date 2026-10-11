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
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="w-full max-w-xs rounded-3xl bg-card p-7 flex flex-col items-center gap-3 text-center shadow-xl">
        <span className="h-14 w-14 rounded-2xl border-b-4 border-[#B63A0E] bg-brass text-white flex items-center justify-center">
          <Zap className="h-7 w-7" />
        </span>
        <p className="font-game text-[11px] text-brass animate-blink">{es ? "¡NIVEL NUEVO!" : "LEVEL UP!"}</p>
        <p className="font-game text-6xl text-ink leading-none animate-level-bounce">{level}</p>
        <p className="font-game text-xs text-brass">{titleForLevel(level, lang).toUpperCase()}</p>
        <button
          type="button"
          onClick={onClose}
          className="btn-chunky mt-2 w-full text-sm py-3"
        >
          {es ? "Seguir" : "Keep going"}
        </button>
      </div>
    </div>
  );
}
