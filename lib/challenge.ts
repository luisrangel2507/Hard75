import { ChallengeDay, TOTAL_DAYS, WATER_GOAL_ML } from "./types";

export function isDayComplete(day: Pick<ChallengeDay,
  "indoor_workout" | "outdoor_workout" | "diet" | "book" | "water_ml" |
  "breakfast_photo_url" | "lunch_photo_url" | "dinner_photo_url" | "progress_photo_url"
> | undefined | null): boolean {
  if (!day) return false;
  return (
    day.indoor_workout === true &&
    day.outdoor_workout === true &&
    day.diet === true &&
    day.book === true &&
    day.water_ml >= WATER_GOAL_ML &&
    !!day.breakfast_photo_url &&
    !!day.lunch_photo_url &&
    !!day.dinner_photo_url &&
    !!day.progress_photo_url
  );
}

export function completedTaskCount(day: ChallengeDay | undefined | null): number {
  if (!day) return 0;
  let count = 0;
  if (day.indoor_workout) count++;
  if (day.outdoor_workout) count++;
  if (day.diet) count++;
  if (day.book) count++;
  if (day.water_ml >= WATER_GOAL_ML) count++;
  const mealsDone = [day.breakfast_photo_url, day.lunch_photo_url, day.dinner_photo_url].filter(Boolean).length;
  if (mealsDone === 3) count++;
  if (day.progress_photo_url) count++;
  return count;
}

/** Streak = consecutive completed days starting from day 1. */
export function computeStreak(daysByNumber: Map<number, ChallengeDay>): number {
  let streak = 0;
  for (let n = 1; n <= TOTAL_DAYS; n++) {
    const day = daysByNumber.get(n);
    if (isDayComplete(day)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** The furthest day number the user is allowed to navigate to. */
export function maxNavigableDay(streak: number): number {
  return Math.min(streak + 1, TOTAL_DAYS);
}

export function isDayLocked(dayNumber: number, streak: number): boolean {
  return dayNumber > maxNavigableDay(streak);
}

export type WeightTrend = "up" | "down" | "flat" | "none";

export function weightTrend(
  daysByNumber: Map<number, ChallengeDay>,
  dayNumber: number
): { trend: WeightTrend; delta: number | null; previousDay: number | null } {
  const current = daysByNumber.get(dayNumber)?.weight_kg;
  if (current == null) return { trend: "none", delta: null, previousDay: null };

  for (let n = dayNumber - 1; n >= 1; n--) {
    const prevWeight = daysByNumber.get(n)?.weight_kg;
    if (prevWeight != null) {
      const delta = Number((current - prevWeight).toFixed(1));
      if (delta > 0) return { trend: "up", delta, previousDay: n };
      if (delta < 0) return { trend: "down", delta, previousDay: n };
      return { trend: "flat", delta: 0, previousDay: n };
    }
  }
  return { trend: "none", delta: null, previousDay: null };
}

export function buildDaysMap(days: ChallengeDay[]): Map<number, ChallengeDay> {
  const map = new Map<number, ChallengeDay>();
  for (const d of days) map.set(d.day_number, d);
  return map;
}
