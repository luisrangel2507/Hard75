import { Flame } from "lucide-react";
import { MountainScene } from "@/components/MountainScene";
import { levelProgress, titleForLevel } from "@/lib/game";
import { getPhase } from "@/lib/phases";
import { Lang } from "@/lib/types";

const BLOCKS = 10;

export function PlayerCard({ xp, day, streak, lang }: { xp: number; day: number; streak: number; lang: Lang }) {
  const es = lang === "es";
  const { level, into, needed, pct } = levelProgress(xp);
  const phase = getPhase(day);
  const filled = Math.round((pct / 100) * BLOCKS);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border min-h-[260px] flex flex-col justify-end">
      <MountainScene variant="hero" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />

      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-2xl bg-panel/80 backdrop-blur px-3 py-2 border border-border">
        <Flame className={`h-4 w-4 ${streak > 0 ? "text-brass" : "text-muted"}`} />
        <span className="font-game text-xs text-white">{streak}</span>
      </div>

      <div className="relative p-4 flex flex-col gap-1.5">
        <span className="font-game text-[10px] text-brass">
          {es ? "NIVEL" : "LEVEL"} {level}
        </span>
        <h2 className="font-game text-3xl leading-tight text-white">{titleForLevel(level, lang).toUpperCase()}</h2>
        <span className="text-sm text-white/85">
          {es ? "Mundo" : "World"} {phase.id} · {phase.name[lang]}
        </span>

        <div className="relative flex gap-[3px] mt-1.5" aria-hidden>
          {Array.from({ length: BLOCKS }, (_, i) => (
            <span key={i} className={`h-3.5 flex-1 rounded-[3px] ${i < filled ? "bg-brass" : "bg-white/15"}`} />
          ))}
          <span className="absolute inset-0 overflow-hidden rounded-[3px] pointer-events-none">
            <span className="block h-full w-1/5 bg-white/25 -skew-x-12 animate-shine" />
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/80">
          <span>
            {into} / {needed} XP
          </span>
          <span className="font-game text-[10px]">
            → {es ? "NV" : "LV"} {level + 1}
          </span>
        </div>
      </div>
    </section>
  );
}
