import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { ChallengeDay } from "@/lib/types";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  redirect(`/day/${maxNavigableDay(computeStreak(buildDaysMap(rows)))}`);
}
