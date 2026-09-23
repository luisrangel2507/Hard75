import { ACHIEVEMENT_DAYS } from "./types";

export type AchievementDay = (typeof ACHIEVEMENT_DAYS)[number];

export function unlockedAchievements(streak: number): AchievementDay[] {
  return ACHIEVEMENT_DAYS.filter((d) => streak >= d);
}

export function isAchievementUnlock(prevStreak: number, nextStreak: number): boolean {
  return ACHIEVEMENT_DAYS.some((d) => prevStreak < d && nextStreak >= d);
}
