import { notFound, redirect } from "next/navigation";
import { query } from "@/lib/db";
import { ChallengeDay, TOTAL_DAYS } from "@/lib/types";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";
import { DayEditor } from "@/components/DayEditor";

export const dynamic = "force-dynamic";

export default async function DayPage({ params }: { params: { day: string } }) {
  const dayNumber = Number(params.day);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    notFound();
  }

  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  const daysMap = buildDaysMap(rows);
  const streak = computeStreak(daysMap);

  if (dayNumber > maxNavigableDay(streak)) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <DayEditor initialDays={rows} dayNumber={dayNumber} />
    </div>
  );
}
