import { query } from "@/lib/db";
import { t } from "@/lib/i18n";
import { resolveLang } from "@/lib/langServer";
import { ChallengeDay, defaultDay } from "@/lib/types";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";
import { totalXp } from "@/lib/game";
import { CelebrationBanner } from "@/components/CelebrationBanner";
import { MissionCard, ProgressCard, StatsRow, WeekStrip } from "@/components/DashboardCards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const lang = resolveLang();
  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  const daysMap = buildDaysMap(rows);
  const streak = computeStreak(daysMap);
  const dayNumber = maxNavigableDay(streak);
  const day = daysMap.get(dayNumber) ?? defaultDay(dayNumber);
  const xp = totalXp(rows);

  return (
    <div className="flex flex-col gap-3.5 min-h-[calc(100dvh-11.5rem-env(safe-area-inset-bottom))] -mb-6">
      {streak === 75 && (
        <CelebrationBanner title={t(lang, "celebrationTitle")} subtitle={t(lang, "celebrationSubtitle")} />
      )}
      <WeekStrip dayNumber={dayNumber} daysMap={daysMap} lang={lang} />
      <MissionCard dayNumber={dayNumber} day={day} xp={xp} lang={lang} />
      <ProgressCard dayNumber={dayNumber} daysMap={daysMap} day={day} lang={lang} />
      <StatsRow streak={streak} xp={xp} dayNumber={dayNumber} lang={lang} />
    </div>
  );
}
