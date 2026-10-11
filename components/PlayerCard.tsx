import { Zap } from "lucide-react";
import { levelProgress, titleForLevel } from "@/lib/game";
import { getPhase } from "@/lib/phases";
import { Lang } from "@/lib/types";

export function PlayerCard({ xp, day, lang }: { xp: number; day: number; lang: Lang }) {
  const es = lang === "es";
  const { level, into, needed, pct } = levelProgress(xp);
  const phase = getPhase(day);

  return (
    <section className="card-base p-4 flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" strokeWidth="5" className="stroke-border" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className="stroke-brass transition-all duration-700"
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={2 * Math.PI * 28 * (1 - pct / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-[9px] font-medium text-muted">{es ? "Nivel" : "Level"}</span>
          <span className="num text-xl font-bold text-ink">{level}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-ink leading-tight truncate">{titleForLevel(level, lang)}</h2>
          <span className="flex items-center gap-1 num text-xs font-semibold text-brass shrink-0">
            <Zap className="h-3 w-3" />
            {xp} XP
          </span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-brass transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>
            {into}/{needed} XP {es ? "al nivel" : "to level"} {level + 1}
          </span>
          <span>
            {es ? "Mundo" : "World"} {phase.id} · {phase.name[lang]}
          </span>
        </div>
      </div>
    </section>
  );
}
