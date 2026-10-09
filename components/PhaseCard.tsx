import { PHASES, getPhase, phaseProgress } from "@/lib/phases";
import { Lang } from "@/lib/types";

const BG = { brass: "bg-brass", ember: "bg-ember", olive: "bg-olive" } as const;
const TEXT = { brass: "text-brass", ember: "text-ember", olive: "text-olive" } as const;

export function PhaseCard({ day, lang }: { day: number; lang: Lang }) {
  const phase = getPhase(day);
  const { dayInPhase, phaseLength, pct } = phaseProgress(day);
  const es = lang === "es";

  return (
    <section className="card-base p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className={`label-caps ${TEXT[phase.color]}`}>
            {es ? "Fase" : "Phase"} {phase.id} {es ? "de" : "of"} {PHASES.length}
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-wide text-ink leading-tight">{phase.name[lang]}</h2>
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
              <span className={`text-[10px] uppercase tracking-wide ${p.id === phase.id ? TEXT[p.color] : "text-muted"}`}>
                {p.name[lang]}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
