import { Swords } from "lucide-react";
import { MountainScene } from "@/components/MountainScene";
import { nextBoss } from "@/lib/game";
import { PHASES, getPhase, phaseProgress } from "@/lib/phases";
import { Lang } from "@/lib/types";

export function PhaseCard({ day, lang }: { day: number; lang: Lang }) {
  const phase = getPhase(day);
  const { pct } = phaseProgress(day);
  const es = lang === "es";
  const boss = nextBoss(day);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border flex flex-col">
      <MountainScene variant="climb" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-bg/10" />

      <div className="relative p-4 pt-5 flex flex-col gap-1 min-h-[210px]">
        <span className="font-game text-[10px] text-white/70">
          {es ? "FASE" : "PHASE"} {phase.id} {es ? "DE" : "OF"} {PHASES.length}
        </span>
        <h2 className="font-game text-2xl leading-tight text-white">{phase.name[lang].toUpperCase()}</h2>
        <p className="text-sm text-white/90 max-w-[60%] leading-snug mt-1">{phase.tagline[lang]}</p>
      </div>

      <div className="relative px-4 pb-4 flex flex-col gap-3">
        <div className="flex items-center">
          {PHASES.map((p, i) => {
            const reached = p.id <= phase.id;
            const fill = p.id < phase.id ? 100 : p.id === phase.id ? pct : 0;
            return (
              <div key={p.id} className="flex items-center flex-1 last:flex-none">
                <span
                  className={`h-4 w-4 rounded-full shrink-0 border-2 ${
                    reached ? "bg-brass border-white" : "bg-border border-muted/60"
                  }`}
                />
                {i < PHASES.length - 1 && (
                  <span className="h-1 flex-1 mx-1 rounded-full bg-border overflow-hidden">
                    <span className="block h-full bg-brass transition-all" style={{ width: `${fill}%` }} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          {PHASES.map((p) => (
            <span key={p.id} className={`text-xs ${p.id === phase.id ? "text-brass font-semibold" : "text-muted"}`}>
              {p.name[lang]}
            </span>
          ))}
        </div>

        {boss && (
          <div className="flex items-center gap-3 rounded-2xl bg-panel/80 backdrop-blur border border-border px-3 py-2.5">
            <span className="h-8 w-8 rounded-xl bg-brass text-white flex items-center justify-center shrink-0">
              <Swords className="h-4 w-4" />
            </span>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[11px] text-muted">
                {boss.daysLeft === 0
                  ? es ? "¡Hoy es el jefe!" : "Boss fight today!"
                  : es ? `Jefe en ${boss.daysLeft} días (día ${boss.day})` : `Boss in ${boss.daysLeft} days (day ${boss.day})`}
              </span>
              <span className="text-sm font-semibold text-ink truncate">{boss.name[lang]}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
