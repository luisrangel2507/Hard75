import { Dumbbell, Bike, BookOpen, Wine, UtensilsCrossed, Camera } from "lucide-react";
import { query } from "@/lib/db";
import { t, DictKey } from "@/lib/i18n";
import { resolveLang } from "@/lib/langServer";
import { ChallengeDay, WATER_GOAL_ML, defaultDay } from "@/lib/types";
import {
  buildDaysMap,
  completedTaskCount,
  computeStreak,
  maxNavigableDay,
} from "@/lib/challenge";
import { StreakFlame } from "@/components/StreakFlame";
import { CelebrationBanner } from "@/components/CelebrationBanner";
import { ProgressRing } from "@/components/ProgressRing";
import Link from "next/link";

export const dynamic = "force-dynamic";

function StatusRow({
  icon: Icon,
  label,
  ok,
  value,
}: {
  icon: typeof Dumbbell;
  label: string;
  ok: boolean;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/70 last:border-b-0">
      <span className="flex items-center gap-3 text-sm text-ink">
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
            ok ? "bg-brass/15 text-brass" : "bg-border/40 text-muted"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </span>
      <span className={`text-xs font-semibold uppercase tracking-wide ${ok ? "text-brass" : "text-muted"}`}>
        {ok && value ? value : ok ? "✓" : "×"}
      </span>
    </div>
  );
}

export default async function DashboardPage() {
  const lang = resolveLang();
  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  const daysMap = buildDaysMap(rows);
  const streak = computeStreak(daysMap);
  const currentDayNumber = maxNavigableDay(streak);
  const currentDay = daysMap.get(currentDayNumber) ?? defaultDay(currentDayNumber);

  const waterPct = Math.min(100, Math.round((currentDay.water_ml / WATER_GOAL_ML) * 100));
  const tasksDone = completedTaskCount(currentDay);
  const mealsDone = [
    currentDay.breakfast_photo_url,
    currentDay.lunch_photo_url,
    currentDay.dinner_photo_url,
  ].filter(Boolean).length;

  return (
    <>
      {streak === 75 && (
        <CelebrationBanner title={t(lang, "celebrationTitle")} subtitle={t(lang, "celebrationSubtitle")} />
      )}

      <section className="card-base p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <ProgressRing value={currentDayNumber} max={75} label={`${t(lang, "day")} / 75`} />
          <StreakFlame streak={streak} label={t(lang, "streak")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="label-caps">{t(lang, "waterOfDay")}</span>
            <span className="num text-muted">{waterPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-steel to-olive transition-all"
              style={{ width: `${waterPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="label-caps">{t(lang, "tasksCompleted")}</span>
          <span className="num text-sm font-semibold text-ink">{tasksDone}/7</span>
        </div>

        <Link
          href={`/day/${currentDayNumber}`}
          className="text-center bg-gradient-to-r from-brass to-ember text-white font-semibold uppercase tracking-wide text-sm rounded-xl py-3 shadow-[0_6px_16px_rgba(255,107,69,0.35)] hover:brightness-105 active:scale-[0.97] transition"
        >
          {t(lang, "goToDay")} {currentDayNumber}
        </Link>
      </section>

      <section className="card-base px-3 py-1">
        <StatusRow
          icon={Dumbbell}
          label={t(lang, "indoorWorkout")}
          ok={currentDay.indoor_workout}
          value={
            currentDay.indoor_type === "other"
              ? currentDay.indoor_type_custom
              : currentDay.indoor_type
                ? t(lang, `ex_${currentDay.indoor_type}` as DictKey)
                : null
          }
        />
        <StatusRow
          icon={Bike}
          label={t(lang, "outdoorWorkout")}
          ok={currentDay.outdoor_workout}
          value={
            currentDay.outdoor_type === "other"
              ? currentDay.outdoor_type_custom
              : currentDay.outdoor_type
                ? t(lang, `ex_${currentDay.outdoor_type}` as DictKey)
                : null
          }
        />
        <StatusRow icon={Camera} label={t(lang, "progressPhoto")} ok={!!currentDay.progress_photo_url} />
        <StatusRow icon={UtensilsCrossed} label={`${t(lang, "meals")} ${mealsDone}/3`} ok={mealsDone === 3} />
        <StatusRow icon={BookOpen} label={t(lang, "book")} ok={currentDay.book} />
        <StatusRow icon={Wine} label={t(lang, "diet")} ok={currentDay.diet} />
      </section>
    </>
  );
}
