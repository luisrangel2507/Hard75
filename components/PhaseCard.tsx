import { SceneImage } from "@/components/SceneImage";
import { PHASES, getPhase, phaseProgress } from "@/lib/phases";
import { Lang } from "@/lib/types";

export function PhaseCard({ day, lang }: { day: number; lang: Lang }) {
  const phase = getPhase(day);
  const { pct, dayInPhase, phaseLength } = phaseProgress(day);
  const es = lang === "es";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card flex flex-col shrink-0">
      <div className="absolute inset-y-0 right-0 w-[62%]">
        <SceneImage name={`phase-${phase.id}`} variant="climb" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 via-45% to-transparent" />

      <div className="relative px-4 pt-3 pb-2 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-game text-base text-white/70">
            {es ? "Fase" : "Phase"} {phase.id} {es ? "de" : "of"} {PHASES.length}
          </span>
          <span className="text-sm text-white/90">
            {es ? "Día" : "Day"} <span className="text-brass font-bold">{dayInPhase}</span> / {phaseLength}
          </span>
        </div>
        <h2 className="font-game text-3xl leading-none text-white">{phase.name[lang]}</h2>
        <p className="text-sm text-white/90 max-w-[58%] leading-snug mt-1 [@media(max-height:720px)]:hidden">{phase.tagline[lang]}</p>
      </div>

      <div className="relative px-4 pb-3 flex flex-col gap-1">
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
            <span key={p.id} className={`text-sm ${p.id === phase.id ? "text-brass font-semibold" : "text-muted"}`}>
              {p.name[lang]}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
