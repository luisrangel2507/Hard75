import { ChallengeDay, Lang, TOTAL_DAYS } from "./types";
import { completedTaskCount, isDayComplete } from "./challenge";

export const XP_PER_TASK = 10;
export const XP_FULL_DAY_BONUS = 30;
export const XP_BOSS_BONUS = 200;
export const TASKS_PER_DAY = 6;

export const BOSS_DAYS = [25, 50, 75] as const;

export const BOSSES: Record<number, Record<Lang, string>> = {
  25: { es: "Guardián de la Fundación", en: "Guardian of Foundation" },
  50: { es: "Titán de la Resistencia", en: "Titan of Endurance" },
  75: { es: "Rey del Dominio", en: "King of Mastery" },
};

const TITLES: { from: number; name: Record<Lang, string> }[] = [
  { from: 1, name: { es: "Novato", en: "Rookie" } },
  { from: 3, name: { es: "Aprendiz", en: "Apprentice" } },
  { from: 5, name: { es: "Guerrero", en: "Warrior" } },
  { from: 7, name: { es: "Veterano", en: "Veteran" } },
  { from: 10, name: { es: "Élite", en: "Elite" } },
  { from: 13, name: { es: "Leyenda", en: "Legend" } },
];

export function dayXp(day: ChallengeDay | undefined | null): number {
  if (!day) return 0;
  let xp = completedTaskCount(day) * XP_PER_TASK;
  if (isDayComplete(day)) {
    xp += XP_FULL_DAY_BONUS;
    if ((BOSS_DAYS as readonly number[]).includes(day.day_number)) xp += XP_BOSS_BONUS;
  }
  return xp;
}

export function totalXp(days: ChallengeDay[]): number {
  return days.reduce((sum, d) => sum + dayXp(d), 0);
}

const XP_UNIT = 50;

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(xp, 0) / XP_UNIT)) + 1;
}

export function levelProgress(xp: number): { level: number; into: number; needed: number; pct: number } {
  const level = levelFromXp(xp);
  const floor = (level - 1) ** 2 * XP_UNIT;
  const ceil = level ** 2 * XP_UNIT;
  const into = xp - floor;
  const needed = ceil - floor;
  return { level, into, needed, pct: Math.min(100, Math.round((into / needed) * 100)) };
}

export function titleForLevel(level: number, lang: Lang): string {
  const t = [...TITLES].reverse().find((x) => level >= x.from) ?? TITLES[0];
  return t.name[lang];
}

export function nextBoss(day: number): { day: number; name: Record<Lang, string>; daysLeft: number } | null {
  const d = Math.min(Math.max(day, 1), TOTAL_DAYS);
  const bossDay = BOSS_DAYS.find((b) => b >= d);
  if (!bossDay) return null;
  return { day: bossDay, name: BOSSES[bossDay], daysLeft: bossDay - d };
}
