import { cookies } from "next/headers";
import { Dumbbell, Bike, BookOpen, Wine, UtensilsCrossed, Camera } from "lucide-react";
import { query } from "@/lib/db";
import { t } from "@/lib/i18n";
import { Lang, ChallengeDay, WATER_GOAL_ML, defaultDay } from "@/lib/types";
import {
  buildDaysMap,
  completedTaskCount,
  computeStreak,
  maxNavigableDay,
} from "@/lib/challenge";
import { StreakFlame } from "@/components/StreakFlame";
import { CelebrationBanner } from "@/components/CelebrationBanner";
import { DayGrid } from "@/components/DayGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

function StatusRow({
  icon: Icon,
  label,
  ok,
}: {
  icon: typeof Dumbbell;
  label: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <span className="flex items-center gap-2.5 text-sm text-ink">
        <Icon className="h-4 w-4 text-muted" />
        {label}
      </span>
      <span className={`text-xs font-semibold uppercase tracking-wide ${ok ? "text-brass" : "text-muted"}`}>
        {ok ? "✓" : "×"}
      </span>
    </div>
  );
}

export default async function DashboardPage() {
  const lang: Lang = cookies().get("ff75_lang")?.value === "en" ? "en" : "es";
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
          <div>
            <p className="label-caps mb-1">{t(lang, "day")}</p>
            <p className="num text-4xl font-bold text-ink">
              {currentDayNumber}
              <span className="text-lg text-muted">/75</span>
            </p>
          </div>
          <StreakFlame streak={streak} label={t(lang, "streak")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="label-caps">{t(lang, "waterOfDay")}</span>
            <span className="num text-muted">{waterPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <div className="h-full bg-steel transition-all" style={{ width: `${waterPct}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="label-caps">{t(lang, "tasksCompleted")}</span>
          <span className="num text-sm font-semibold text-ink">{tasksDone}/7</span>
        </div>

        <Link
          href={`/day/${currentDayNumber}`}
          className="text-center bg-brass text-bg font-semibold uppercase tracking-wide text-sm rounded-md py-2.5 hover:brightness-110 transition"
        >
          {t(lang, "goToDay")} {currentDayNumber}
        </Link>
      </section>

      <section className="card-base p-1">
        <StatusRow icon={Dumbbell} label={t(lang, "indoorWorkout")} ok={currentDay.indoor_workout} />
        <StatusRow icon={Bike} label={t(lang, "outdoorWorkout")} ok={currentDay.outdoor_workout} />
        <StatusRow icon={Camera} label={t(lang, "progressPhoto")} ok={!!currentDay.progress_photo_url} />
        <StatusRow icon={UtensilsCrossed} label={`${t(lang, "meals")} ${mealsDone}/3`} ok={mealsDone === 3} />
        <StatusRow icon={BookOpen} label={t(lang, "book")} ok={currentDay.book} />
        <StatusRow icon={Wine} label={t(lang, "diet")} ok={currentDay.diet} />
      </section>

      <section className="flex flex-col gap-3">
        <p className="label-caps">
          {t(lang, "dashboard")} · {t(lang, "of75")}
        </p>
        <DayGrid daysByNumber={daysMap} streak={streak} currentDay={currentDayNumber} />
      </section>
    </>
  );
}
