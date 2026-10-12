import Link from "next/link";
import { Apple, ArrowRight, BookOpen, Camera, Check, Droplets, Dumbbell, Flame } from "lucide-react";
import { isDayComplete } from "@/lib/challenge";
import { ChallengeDay, Lang, TOTAL_DAYS, WATER_GOAL_ML } from "@/lib/types";

function Ring({
  pct,
  icon: Icon,
  tone,
  value,
  label,
  sub,
}: {
  pct: number;
  icon: typeof Dumbbell;
  tone: "brass" | "steel";
  value: string;
  label: string;
  sub: string;
}) {
  const size = 58;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const done = pct >= 100;
  const color = done ? "stroke-olive" : tone === "steel" ? "stroke-steel" : "stroke-brass";
  const iconColor = done ? "text-olive" : tone === "steel" ? "text-steel" : "text-white";

  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <div className="relative h-[58px] w-[58px]">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-border" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className={`${color} transition-[stroke-dashoffset] duration-700`}
            strokeDasharray={c}
            strokeDashoffset={c * (1 - Math.max(Math.min(pct, 100), 5) / 100)}
          />
        </svg>
        <Icon className={`absolute inset-0 m-auto h-5 w-5 ${iconColor}`} />
        {done && (
          <span className="absolute -top-0.5 right-0 h-4 w-4 rounded-full bg-olive text-white flex items-center justify-center">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
      </div>
      <span className="num text-base font-bold text-ink mt-1">{value}</span>
      <span className="text-xs text-ink/90 leading-tight">{label}</span>
      <span className={`text-[10px] leading-tight ${done ? "text-olive" : "text-muted"}`}>{sub}</span>
    </div>
  );
}

export function DayCard({
  day,
  dayNumber,
  streak,
  daysMap,
  lang,
}: {
  day: ChallengeDay;
  dayNumber: number;
  streak: number;
  daysMap: Map<number, ChallengeDay>;
  lang: Lang;
}) {
  const es = lang === "es";
  const LETTERS = es ? ["D", "L", "M", "M", "J", "V", "S"] : ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const weekStart = Math.floor((dayNumber - 1) / 7) * 7 + 1;
  const waterPct = Math.min(100, Math.round((day.water_ml / WATER_GOAL_ML) * 100));
  const workouts = Number(day.indoor_workout) + Number(day.outdoor_workout);
  
  return (
    <section className="card-base p-4 flex flex-col gap-4">
      <div className="flex items-stretch justify-between gap-3">
        <div className="flex flex-col justify-between gap-3 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-game text-2xl text-white">{es ? "DÍA" : "DAY"}</span>
            <span className="font-game text-6xl text-brass leading-none">{dayNumber}</span>
            <span className="font-game text-base text-white">/{TOTAL_DAYS}</span>
          </div>
          <div className="flex gap-2" aria-label={es ? "Semana" : "Week"}>
            {Array.from({ length: 7 }, (_, i) => {
              const n = weekStart + i;
              if (n > TOTAL_DAYS) return null;
              const complete = isDayComplete(daysMap.get(n));
              const current = n === dayNumber;
              return (
                <div key={n} className="flex flex-col items-center gap-1">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      complete ? "bg-brass" : current ? "bg-brass/30 ring-2 ring-brass" : "bg-border"
                    }`}
                  />
                  <span className="text-[10px] text-muted">{LETTERS[new Date(today.getTime() + (n - dayNumber) * 86400000).getDay()]}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="shrink-0 rounded-2xl bg-panel/60 border border-border px-4 py-2 flex flex-col items-center justify-center">
          <span className="font-game text-[11px] text-muted">{es ? "RACHA" : "STREAK"}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <Flame className={`h-5 w-5 ${streak > 0 ? "text-brass" : "text-muted"}`} />
            <span className="font-game text-3xl text-white">{streak}</span>
          </div>
          <span className="text-[10px] text-muted">{es ? "Días" : "Days"}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-x-1">
        <Ring pct={waterPct} icon={Droplets} tone="steel" value={`${waterPct}%`} label={es ? "Agua" : "Water"} sub="3.8 L" />
        <Ring
          pct={(workouts / 2) * 100}
          icon={Dumbbell}
          tone="brass"
          value={`${workouts}/2`}
          label={es ? "Entrenos" : "Workouts"}
          sub={es ? "2 sesiones" : "2 sessions"}
        />
        <Ring
          pct={day.book ? 100 : 0}
          icon={BookOpen}
          tone="brass"
          value={`${Number(day.book)}/1`}
          label={es ? "Lectura" : "Reading"}
          sub={es ? "10+ págs" : "10+ pages"}
        />
        <Ring
          pct={day.diet ? 100 : 0}
          icon={Apple}
          tone="brass"
          value={`${Number(day.diet)}/1`}
          label={es ? "Dieta" : "Diet"}
          sub={es ? "Sin alcohol" : "No alcohol"}
        />
        <Ring
          pct={day.progress_photo_url ? 100 : 0}
          icon={Camera}
          tone="brass"
          value={`${Number(!!day.progress_photo_url)}/1`}
          label={es ? "Foto" : "Progress"}
          sub={day.progress_photo_url ? (es ? "Hecho" : "Done") : es ? "Pendiente" : "Pending"}
        />
      </div>

      <Link
        href={`/day/${dayNumber}`}
        className="relative overflow-hidden flex items-center justify-center gap-2 py-4 text-xl font-game text-white rounded-2xl border-b-[3px] border-[#B63A0E] bg-gradient-to-b from-[#FF7A2E] to-[#F2480F] shadow-[0_6px_20px_rgba(255,90,31,0.3),inset_0_1px_0_rgba(255,255,255,0.35)] active:translate-y-[2px] transition-transform"
      >
        <svg viewBox="0 0 80 50" className="absolute left-3 bottom-0 h-9 opacity-35" aria-hidden>
          <path d="M0 50 L26 8 L40 30 L54 14 L80 50Z" fill="#6E1E02" />
        </svg>
        <span>
          {es ? "Ir al día" : "Go to day"} {dayNumber}
        </span>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </section>
  );
}
