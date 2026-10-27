import Link from "next/link";
import { ArrowRight, ChevronRight, Flame, Layers, Sparkles, Zap } from "lucide-react";
import { completedTaskCount, isDayComplete } from "@/lib/challenge";
import { TASKS_PER_DAY, levelProgress, titleForLevel } from "@/lib/game";
import { findImage } from "@/lib/images";
import { getPhase } from "@/lib/phases";
import { ChallengeDay, Lang, TOTAL_DAYS } from "@/lib/types";

const LETTERS = {
  es: ["D", "L", "M", "M", "J", "V", "S"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

function weekOf(dayNumber: number) {
  const start = Math.floor((dayNumber - 1) / 7) * 7 + 1;
  return Array.from({ length: 7 }, (_, i) => start + i).filter((n) => n <= TOTAL_DAYS);
}

function weekdayLetter(n: number, dayNumber: number, lang: Lang) {
  const d = new Date(Date.now() + (n - dayNumber) * 86400000);
  return LETTERS[lang][d.getDay()];
}

export function WeekStrip({
  dayNumber,
  daysMap,
  lang,
}: {
  dayNumber: number;
  daysMap: Map<number, ChallengeDay>;
  lang: Lang;
}) {
  return (
    <div className="flex items-end justify-between px-2" aria-label={lang === "es" ? "Semana" : "Week"}>
      {weekOf(dayNumber).map((n) => {
        const done = isDayComplete(daysMap.get(n));
        const current = n === dayNumber;
        const future = n > dayNumber;
        return (
          <Link
            key={n}
            href={future ? "#" : `/day/${n}`}
            aria-disabled={future}
            className={`flex flex-col items-center gap-1.5 ${future ? "pointer-events-none" : ""}`}
          >
            <span
              className={`rounded-full flex items-center justify-center num transition ${
                current
                  ? "h-14 w-14 text-xl font-semibold text-white bg-white/10 ring-2 ring-white/70 shadow-[0_0_28px_rgba(255,160,100,0.45)]"
                  : done
                    ? "h-11 w-11 text-sm font-medium text-white bg-brass/35 ring-1 ring-brass/70"
                    : "h-11 w-11 text-sm text-white/60 bg-white/[0.06]"
              }`}
            >
              {n}
            </span>
            <span className={`text-xs ${current ? "text-white font-medium" : "text-white/55"}`}>
              {weekdayLetter(n, dayNumber, lang)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function MissionCard({
  dayNumber,
  day,
  xp,
  lang,
}: {
  dayNumber: number;
  day: ChallengeDay;
  xp: number;
  lang: Lang;
}) {
  const es = lang === "es";
  const phase = getPhase(dayNumber);
  const { level } = levelProgress(xp);
  const done = completedTaskCount(day);
  const hero = findImage("hero");

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl flex-1 min-h-[215px] flex flex-col items-center justify-end text-center px-5 pb-5">
      {hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div
        className="absolute left-1/2 top-6 -translate-x-1/2 h-28 w-28 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,170,110,0.75), rgba(255,122,61,0.25) 55%, transparent 72%)" }}
      />
      <Sparkles className="absolute left-1/2 top-[52px] -translate-x-1/2 h-9 w-9 text-white/90" strokeWidth={1.5} />

      <div className="relative flex flex-col items-center gap-1.5 w-full">
        <span className="flex items-center gap-1.5 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
          {es ? "Nivel" : "Level"} {level} · {titleForLevel(level, lang)}
        </span>
        <h1 className="font-game text-[32px] leading-tight font-medium text-white">
          {es ? "Día" : "Day"} {dayNumber} · {phase.name[lang]}
        </h1>
        <p className="text-sm text-white/65 max-w-[85%] leading-snug">{phase.tagline[lang]}</p>
        <div className="flex items-center gap-4 text-xs text-white/70 mt-1">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            {done}/{TASKS_PER_DAY} {es ? "tareas" : "tasks"}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            {xp} XP
          </span>
        </div>
        <Link
          href={`/day/${dayNumber}`}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-[0_8px_30px_rgba(255,255,255,0.18)] active:scale-95 transition"
        >
          {es ? "Ir al día" : "Go to day"} {dayNumber}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function ProgressCard({
  dayNumber,
  daysMap,
  day,
  lang,
}: {
  dayNumber: number;
  daysMap: Map<number, ChallengeDay>;
  day: ChallengeDay;
  lang: Lang;
}) {
  const es = lang === "es";
  const pct = Math.round((completedTaskCount(day) / TASKS_PER_DAY) * 100);
  const week = weekOf(dayNumber);

  return (
    <Link href="/progress" className="card-base px-5 py-4 flex flex-col gap-3 shrink-0 active:scale-[0.99] transition">
      <div className="flex items-center justify-between text-sm text-white/75">
        <span className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-brass" />
          {es ? "Progreso de hoy" : "Today's progress"}
        </span>
        <ChevronRight className="h-4 w-4" />
      </div>
      <div className="flex items-end justify-between gap-4">
        <span className="font-game text-[44px] leading-none font-light text-white">{pct}%</span>
        <div className="flex items-end gap-2.5 h-14">
          {week.map((n) => {
            const frac = n === dayNumber ? completedTaskCount(day) / TASKS_PER_DAY : n < dayNumber ? completedTaskCount(daysMap.get(n)) / TASKS_PER_DAY : 0;
            const current = n === dayNumber;
            return (
              <div key={n} className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-11 rounded-full bg-white/10 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-full ${current ? "bg-gradient-to-t from-[#E8590C] to-[#FFB070]" : "bg-gradient-to-t from-brass/70 to-brass/30"}`}
                    style={{ height: `${Math.max(frac * 100, frac > 0 ? 12 : 0)}%` }}
                  />
                </div>
                <span className="text-[9px] text-white/45">{weekdayLetter(n, dayNumber, lang)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
}

export function StatsRow({ streak, xp, dayNumber, lang }: { streak: number; xp: number; dayNumber: number; lang: Lang }) {
  const es = lang === "es";
  const { level, into, needed } = levelProgress(xp);
  const phase = getPhase(dayNumber);
  const stats = [
    { value: `${streak} ${es ? "días" : "days"}`, label: es ? "Racha actual" : "Current streak", tone: "text-white" },
    { value: titleForLevel(level, lang), label: `${into}/${needed} XP`, tone: "text-white" },
    { value: phase.name[lang], label: `${es ? "Mundo" : "World"} ${phase.id}`, tone: "text-brass" },
  ];
  return (
    <section className="card-base grid grid-cols-3 divide-x divide-white/10 py-3.5 shrink-0">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-0.5 px-2 text-center">
          <span className={`text-[15px] font-medium leading-tight ${s.tone}`}>{s.value}</span>
          <span className="text-[11px] text-white/50">{s.label}</span>
        </div>
      ))}
    </section>
  );
}
