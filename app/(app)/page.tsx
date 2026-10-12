import { query } from "@/lib/db";
import { t } from "@/lib/i18n";
import { resolveLang } from "@/lib/langServer";
import { ChallengeDay, defaultDay } from "@/lib/types";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";
import { totalXp } from "@/lib/game";
import { CelebrationBanner } from "@/components/CelebrationBanner";
import { PlayerCard } from "@/components/PlayerCard";
import { DayCard } from "@/components/DayCard";
import { PhaseCard } from "@/components/PhaseCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const lang = resolveLang();
  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  const daysMap = buildDaysMap(rows);
  const streak = computeStreak(daysMap);
  const currentDayNumber = maxNavigableDay(streak);
  const currentDay = daysMap.get(currentDayNumber) ?? defaultDay(currentDayNumber);

  return (
    <div className="flex flex-col gap-3 min-h-[calc(100dvh-8.5rem-env(safe-area-inset-bottom))] -mb-6">
      {streak === 75 && (
        <CelebrationBanner title={t(lang, "celebrationTitle")} subtitle={t(lang, "celebrationSubtitle")} />
      )}

      <PlayerCard xp={totalXp(rows)} day={currentDayNumber} streak={streak} lang={lang} />
      <DayCard day={currentDay} dayNumber={currentDayNumber} streak={streak} daysMap={daysMap} lang={lang} />
      <PhaseCard day={currentDayNumber} lang={lang} />
    </div>
  );
}
