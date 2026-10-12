import Link from "next/link";
import { Apple, BookOpen, Camera, Check, ChevronRight, Droplets, Dumbbell, UtensilsCrossed } from "lucide-react";
import { completedTaskCount } from "@/lib/challenge";
import { TASKS_PER_DAY } from "@/lib/game";
import { ChallengeDay, Lang, WATER_GOAL_ML } from "@/lib/types";

export function TaskList({ day, dayNumber, lang }: { day: ChallengeDay; dayNumber: number; lang: Lang }) {
  const es = lang === "es";
  const waterPct = Math.min(100, Math.round((day.water_ml / WATER_GOAL_ML) * 100));
  const meals = [day.breakfast_photo_url, day.lunch_photo_url, day.dinner_photo_url].filter(Boolean).length;

  const rows: { icon: typeof Dumbbell; label: string; done: boolean; extra?: string; progress?: number }[] = [
    { icon: Droplets, label: es ? "Toma 3.8 L de agua" : "Drink 3.8 L of water", done: day.water_ml >= WATER_GOAL_ML, progress: waterPct },
    { icon: Dumbbell, label: es ? "Entreno interior" : "Indoor workout", done: day.indoor_workout },
    { icon: Dumbbell, label: es ? "Entreno exterior" : "Outdoor workout", done: day.outdoor_workout },
    { icon: BookOpen, label: es ? "Lee 10 páginas" : "Read 10 pages", done: day.book },
    { icon: Apple, label: es ? "Dieta limpia, sin alcohol" : "Healthy diet, no alcohol", done: day.diet },
    { icon: UtensilsCrossed, label: es ? "Foto de tus 3 comidas" : "Photo of your 3 meals", done: meals === 3, extra: `${meals}/3` },
    { icon: Camera, label: es ? "Foto de progreso" : "Progress photo", done: !!day.progress_photo_url },
  ];

  return (
    <section className="card-base p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 pt-1">
        <h3 className="font-game text-xl text-white">{es ? "Tareas de hoy" : "Today's tasks"}</h3>
        <span className="font-game text-xl text-white">
          {completedTaskCount(day)}/{TASKS_PER_DAY}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map(({ icon: Icon, label, done, extra, progress }) => (
          <li key={label}>
            <Link
              href={`/day/${dayNumber}`}
              className="flex items-center gap-3 rounded-2xl bg-panel/50 border border-border px-3 py-3 active:scale-[0.99] transition"
            >
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  done ? "bg-olive text-white" : "border-2 border-muted/70"
                }`}
              >
                {done && <Check className="h-4 w-4" strokeWidth={3} />}
              </span>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span className={`text-[15px] leading-tight ${done ? "text-ink" : "text-ink/90"}`}>{label}</span>
                {progress !== undefined && (
                  <span className="h-1.5 rounded-full bg-border overflow-hidden">
                    <span className="block h-full rounded-full bg-steel transition-all" style={{ width: `${progress}%` }} />
                  </span>
                )}
              </div>
              {progress !== undefined ? (
                <span className="num text-sm font-semibold text-steel">{progress}%</span>
              ) : extra ? (
                <span className="num text-sm text-muted">{extra}</span>
              ) : (
                <Icon className="h-5 w-5 text-muted" />
              )}
              <ChevronRight className="h-5 w-5 text-muted/70 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
