import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  const es = lang === "es";

  return (
    <>
      {streak === 75 && (
        <CelebrationBanner title={t(lang, "celebrationTitle")} subtitle={t(lang, "celebrationSubtitle")} />
      )}

      <PlayerCard xp={totalXp(rows)} day={currentDayNumber} streak={streak} lang={lang} />

      <DayCard day={currentDay} dayNumber={currentDayNumber} streak={streak} daysMap={daysMap} lang={lang} />

      <PhaseCard day={currentDayNumber} lang={lang} />

      <Link
        href={`/day/${currentDayNumber}`}
        className="relative overflow-hidden flex items-center justify-center gap-2 py-5 text-base font-game text-white rounded-2xl border-b-4 border-[#B63A0E] bg-gradient-to-b from-[#FF7A2E] to-[#F2480F] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] active:translate-y-[3px] active:border-b-[1px] transition-transform"
      >
        <span>
          {es ? "IR AL DÍA" : "GO TO DAY"} {currentDayNumber}
        </span>
        <ArrowRight className="h-5 w-5" />
        <svg viewBox="0 0 80 50" className="absolute right-3 bottom-0 h-10 opacity-40" aria-hidden>
          <path d="M0 50 L26 8 L40 30 L54 14 L80 50Z" fill="#8A2A05" />
        </svg>
      </Link>
    </>
  );
}
