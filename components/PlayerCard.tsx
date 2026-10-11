import { Flame } from "lucide-react";
import { levelProgress, titleForLevel } from "@/lib/game";
import { getPhase } from "@/lib/phases";
import { Lang } from "@/lib/types";

const BLOCKS = 12;

export function PlayerCard({ xp, day, streak, lang }: { xp: number; day: number; streak: number; lang: Lang }) {
  const es = lang === "es";
  const { level, into, needed, pct } = levelProgress(xp);
  const phase = getPhase(day);
  const filled = Math.round((pct / 100) * BLOCKS);

  return (
    <section className="rounded-3xl bg-ink text-white p-4 flex flex-col gap-3 border-b-4 border-black">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-brass border-b-4 border-[#B5500F] flex flex-col items-center justify-center animate-level-bounce">
          <span className="font-game text-[7px] leading-none opacity-80">LVL</span>
          <span className="font-game text-xl leading-none mt-1">{level}</span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <span className="font-game text-[11px] leading-tight truncate">{titleForLevel(level, lang).toUpperCase()}</span>
          <span className="text-[11px] text-white/60 truncate">
            {es ? "Mundo" : "World"} {phase.id} · {phase.name[lang]}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 rounded-xl bg-white/10 px-2.5 py-1.5">
          <Flame className={`h-4 w-4 ${streak > 0 ? "text-brass" : "text-white/40"}`} />
          <span className="font-game text-xs">{streak}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="relative flex gap-[3px]" aria-hidden>
          {Array.from({ length: BLOCKS }, (_, i) => (
            <span key={i} className={`h-3.5 flex-1 rounded-[3px] ${i < filled ? "bg-brass" : "bg-white/15"}`} />
          ))}
          <span className="absolute inset-0 overflow-hidden rounded-[3px] pointer-events-none">
            <span className="block h-full w-1/5 bg-white/25 -skew-x-12 animate-shine" />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-game text-[9px] text-white/80">{xp} XP</span>
          <span className="font-game text-[9px] text-white/50">
            {into}/{needed} → {es ? "NV" : "LV"} {level + 1}
          </span>
        </div>
      </div>
    </section>
  );
}
