import { Flame } from "lucide-react";
import { SceneImage } from "@/components/SceneImage";
import { levelProgress, titleForLevel } from "@/lib/game";
import { getPhase } from "@/lib/phases";
import { Lang } from "@/lib/types";

const SEGMENTS = 12;

export function PlayerCard({ xp, day, streak, lang }: { xp: number; day: number; streak: number; lang: Lang }) {
  const es = lang === "es";
  const { level, into, needed, pct } = levelProgress(xp);
  const phase = getPhase(day);
  const filled = Math.round((pct / 100) * SEGMENTS);

  return (
    <section className="relative overflow-hidden -mx-4 -mt-6 min-h-[340px] flex flex-col justify-end border-b border-border">
      <SceneImage name="hero" variant="hero" position="70% center" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 via-30% to-transparent to-60%" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />

      <div className="absolute top-[60px] right-4 flex items-center gap-1.5 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 pl-2 pr-3 py-1.5">
        <Flame className={`h-5 w-5 ${streak > 0 ? "text-brass" : "text-brass/70"}`} />
        <span className="font-game text-xl leading-none text-white">{streak}</span>
      </div>

      <div className="relative px-4 pb-4 flex flex-col gap-0.5">
        <span className="font-game text-base text-brass">
          {es ? "Nivel" : "Level"} {level}
        </span>
        <h2 className="font-game text-6xl leading-[0.95] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {titleForLevel(level, lang)}
        </h2>
        <span className="text-base text-white/90 mt-1">
          {es ? "Mundo" : "World"} {phase.id} · {phase.name[lang]}
        </span>

        <div className="flex gap-[3px] mt-3" aria-hidden>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span
              key={i}
              className={`h-3 flex-1 -skew-x-[20deg] rounded-[3px] ${
                i < filled ? "bg-gradient-to-b from-[#FF8A3D] to-[#F2480F]" : "bg-white/15"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-white/85 mt-1">
          <span className="num">
            {into} / {needed} XP
          </span>
          <span className="font-game text-base">
            → {es ? "Niv" : "Lv"} {level + 1}
          </span>
        </div>
      </div>
    </section>
  );
}
