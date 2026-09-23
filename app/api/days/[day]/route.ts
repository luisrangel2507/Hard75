import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";
import { ChallengeDay, defaultDay, TOTAL_DAYS } from "@/lib/types";

export const dynamic = "force-dynamic";

function parseDayNumber(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > TOTAL_DAYS) return null;
  return n;
}

export async function GET(_req: NextRequest, { params }: { params: { day: string } }) {
  const dayNumber = parseDayNumber(params.day);
  if (dayNumber === null) {
    return NextResponse.json({ error: "invalid day" }, { status: 400 });
  }
  const rows = await query<ChallengeDay>(
    "SELECT * FROM challenge_days WHERE day_number = $1",
    [dayNumber]
  );
  return NextResponse.json({ day: rows[0] ?? defaultDay(dayNumber) });
}

const EDITABLE_FIELDS = [
  "indoor_workout",
  "indoor_type",
  "indoor_type_custom",
  "outdoor_workout",
  "outdoor_type",
  "outdoor_type_custom",
  "diet",
  "calories",
  "book",
  "water_ml",
  "weight_kg",
  "notes",
  "progress_photo_url",
  "breakfast_photo_url",
  "lunch_photo_url",
  "dinner_photo_url",
] as const;

export async function PATCH(req: NextRequest, { params }: { params: { day: string } }) {
  const dayNumber = parseDayNumber(params.day);
  if (dayNumber === null) {
    return NextResponse.json({ error: "invalid day" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  try {
    const allRows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
    const daysMap = buildDaysMap(allRows);
    const streak = computeStreak(daysMap);
    if (dayNumber > maxNavigableDay(streak)) {
      return NextResponse.json({ error: "day locked" }, { status: 403 });
    }

    const existing = daysMap.get(dayNumber) ?? defaultDay(dayNumber);
    const mergedRecord: Record<string, unknown> = { ...existing };

    for (const field of EDITABLE_FIELDS) {
      if (field in body) {
        mergedRecord[field] = body[field as keyof typeof body];
      }
    }

    const merged = mergedRecord as unknown as ChallengeDay;

    if (typeof merged.water_ml !== "number" || merged.water_ml < 0) merged.water_ml = 0;
    if (merged.weight_kg !== null && typeof merged.weight_kg !== "number") merged.weight_kg = null;
    if (typeof merged.notes !== "string") merged.notes = "";

    const rows = await query<ChallengeDay>(
      `INSERT INTO challenge_days (
         day_number, indoor_workout, indoor_type, indoor_type_custom,
         outdoor_workout, outdoor_type, outdoor_type_custom,
         diet, calories, book, water_ml,
         weight_kg, notes, progress_photo_url, breakfast_photo_url, lunch_photo_url, dinner_photo_url, updated_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, now())
       ON CONFLICT (day_number) DO UPDATE SET
         indoor_workout = EXCLUDED.indoor_workout,
         indoor_type = EXCLUDED.indoor_type,
         indoor_type_custom = EXCLUDED.indoor_type_custom,
         outdoor_workout = EXCLUDED.outdoor_workout,
         outdoor_type = EXCLUDED.outdoor_type,
         outdoor_type_custom = EXCLUDED.outdoor_type_custom,
         diet = EXCLUDED.diet,
         calories = EXCLUDED.calories,
         book = EXCLUDED.book,
         water_ml = EXCLUDED.water_ml,
         weight_kg = EXCLUDED.weight_kg,
         notes = EXCLUDED.notes,
         progress_photo_url = EXCLUDED.progress_photo_url,
         breakfast_photo_url = EXCLUDED.breakfast_photo_url,
         lunch_photo_url = EXCLUDED.lunch_photo_url,
         dinner_photo_url = EXCLUDED.dinner_photo_url,
         updated_at = now()
       RETURNING *`,
      [
        dayNumber,
        merged.indoor_workout,
        merged.indoor_type,
        merged.indoor_type_custom,
        merged.outdoor_workout,
        merged.outdoor_type,
        merged.outdoor_type_custom,
        merged.diet,
        merged.calories,
        merged.book,
        merged.water_ml,
        merged.weight_kg,
        merged.notes,
        merged.progress_photo_url,
        merged.breakfast_photo_url,
        merged.lunch_photo_url,
        merged.dinner_photo_url,
      ]
    );

    return NextResponse.json({ day: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
