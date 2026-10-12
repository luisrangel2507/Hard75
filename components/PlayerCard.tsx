import { Flame } from "lucide-react";
import { SceneImage } from "@/components/SceneImage";
import { levelProgress, titleForLevel } from "@/lib/game";
import { getPhase } from "@/lib/phases";
import { Lang } from "@/lib/types";

const SEGMENTS = 12;
const HEX = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

export function PlayerCard({ xp, day, streak, lang }: { xp: number; day: number; streak: number; lang: Lang }) {
  const es = lang === "es";
  const { level, into, needed, pct } = levelProgress(xp);
  const phase = getPhase(day);
  const filled = Math.round((pct / 100) * SEGMENTS);

  return (
    <section className="relative overflow-hidden -mx-4 -mt-6 min-h-[480px] flex flex-col justify-end border-b border-border">
      <SceneImage name="hero" variant="hero" position="70% center" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 via-35% to-transparent to-65%" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />

      <div className="absolute top-[72px] right-4 flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 pl-2.5 pr-3.5 py-1.5">
        <Flame className={`h-5 w-5 ${streak > 0 ? "text-brass" : "text-white/60"}`} />
        <span className="font-game text-xl leading-none text-white">{streak}</span>
      </div>

      <div className="relative px-4 pb-5 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div
            className="h-14 w-14 shrink-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#FF8A3D] to-[#F2480F] text-white"
            style={{ clipPath: HEX }}
            aria-label={`${es ? "Nivel" : "Level"} ${level}`}
          >
            <span className="font-game text-[10px] leading-none opacity-90">{es ? "NIV" : "LVL"}</span>
            <span className="font-game text-2xl leading-none">{level}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="font-game text-5xl leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
              {titleForLevel(level, lang)}
            </h2>
            <span className="text-sm text-white/85 mt-1">
              {es ? "Mundo" : "World"} {phase.id} · {phase.name[lang]}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 max-w-[80%] mt-1">
          <div className="relative flex gap-[3px]" aria-hidden>
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 -skew-x-[20deg] rounded-[2px] ${
                  i < filled ? "bg-gradient-to-b from-[#FF8A3D] to-brass" : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-white/85">
            <span className="num">
              {into} / {needed} XP
            </span>
            <span className="font-game text-base">
              → {es ? "NIV" : "LVL"} {level + 1}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
