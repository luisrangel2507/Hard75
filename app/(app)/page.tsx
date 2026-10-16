import { query } from "@/lib/db";
import { t } from "@/lib/i18n";
import { resolveLang } from "@/lib/langServer";
import { ChallengeDay, defaultDay } from "@/lib/types";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";
import { totalXp } from "@/lib/game";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      <Link
        href={`/day/${currentDayNumber}`}
        className="relative overflow-hidden shrink-0 flex items-center justify-center gap-2 py-3.5 text-xl font-game text-white rounded-2xl border-b-[3px] border-[#B63A0E] bg-gradient-to-b from-[#FF7A2E] to-[#F2480F] shadow-[0_6px_20px_rgba(255,90,31,0.3),inset_0_1px_0_rgba(255,255,255,0.35)] active:translate-y-[2px] transition-transform"
      >
        <span>
          {lang === "es" ? "Ir al día" : "Go to day"} {currentDayNumber}
        </span>
        <ArrowRight className="h-5 w-5" />
        <svg viewBox="0 0 80 50" className="absolute right-3 bottom-0 h-9 opacity-40" aria-hidden>
          <path d="M0 50 L26 8 L40 30 L54 14 L80 50Z" fill="#6E1E02" />
        </svg>
      </Link>
    </div>
  );
}
