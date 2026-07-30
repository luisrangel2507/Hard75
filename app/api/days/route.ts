import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ChallengeDay } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<ChallengeDay>(
    "SELECT * FROM challenge_days ORDER BY day_number ASC"
  );
  return NextResponse.json({ days: rows });
}
