import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { buildDaysMap, computeStreak } from "@/lib/challenge";
import { ChallengeDay } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
    return NextResponse.json({ streak: computeStreak(buildDaysMap(rows)) });
  } catch {
    return NextResponse.json({ streak: 0 });
  }
}
