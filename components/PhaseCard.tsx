import { PHASES, getPhase, phaseProgress } from "@/lib/phases";
import { Lang } from "@/lib/types";
import { nextBoss } from "@/lib/game";
import { Swords } from "lucide-react";

const BG = { brass: "bg-brass", ember: "bg-ember", olive: "bg-olive" } as const;
const TEXT = { brass: "text-brass", ember: "text-ember", olive: "text-olive" } as const;

export function PhaseCard({ day, lang }: { day: number; lang: Lang }) {
  const phase = getPhase(day);
  const { dayInPhase, phaseLength, pct } = phaseProgress(day);
  const es = lang === "es";
  const boss = nextBoss(day);

  return (
    <section className="card-base p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className={`label-caps ${TEXT[phase.color]}`}>
            {es ? "Fase" : "Phase"} {phase.id} {es ? "de" : "of"} {PHASES.length}
          </span>
          <h2 className="text-2xl font-bold text-ink leading-tight">{phase.name[lang]}</h2>
        </div>
        <span className="num text-xs text-muted text-right shrink-0 pt-1">
          {es ? "Día" : "Day"} {dayInPhase}/{phaseLength}
        </span>
      </div>

      <p className="text-sm text-ink/80 leading-snug">{phase.tagline[lang]}</p>

      <div className="flex gap-1.5">
        {PHASES.map((p) => {
          const fill = p.id < phase.id ? 100 : p.id === phase.id ? pct : 0;
          return (
            <div key={p.id} className="flex-1 flex flex-col gap-1">
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div className={`h-full rounded-full ${BG[p.color]} transition-all`} style={{ width: `${fill}%` }} />
              </div>
              <span className={`text-[10px] ${p.id === phase.id ? TEXT[p.color] : "text-muted"}`}>
                {p.name[lang]}
              </span>
            </div>
          );
        })}
      </div>

      {boss && (
        <div className="flex items-center gap-3 rounded-xl bg-bg px-3 py-2.5">
          <span className="h-8 w-8 rounded-full bg-ink text-white flex items-center justify-center shrink-0">
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
    </section>
  );
}
