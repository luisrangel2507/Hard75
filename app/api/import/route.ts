import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { ChallengeDay, TOTAL_DAYS } from "@/lib/types";

export const dynamic = "force-dynamic";

const EDITABLE_FIELDS = [
  "day_number",
  "indoor_workout",
  "outdoor_workout",
  "diet",
  "book",
  "water_ml",
  "weight_kg",
  "notes",
  "progress_photo_url",
  "breakfast_photo_url",
  "lunch_photo_url",
  "dinner_photo_url",
] as const;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const days = body?.days as ChallengeDay[] | undefined;
  const settings = body?.settings as Record<string, string> | undefined;

  if (!Array.isArray(days)) {
    return NextResponse.json({ error: "invalid payload: days must be an array" }, { status: 400 });
  }
  for (const d of days) {
    if (
      typeof d?.day_number !== "number" ||
      d.day_number < 1 ||
      d.day_number > TOTAL_DAYS
    ) {
      return NextResponse.json({ error: "invalid payload: bad day_number" }, { status: 400 });
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM challenge_days");

    for (const d of days) {
      const values = EDITABLE_FIELDS.map((f) => (d as unknown as Record<string, unknown>)[f] ?? null);
      const placeholders = EDITABLE_FIELDS.map((_, i) => `$${i + 1}`).join(", ");
      await client.query(
        `INSERT INTO challenge_days (${EDITABLE_FIELDS.join(", ")}) VALUES (${placeholders})`,
        values
      );
    }

    if (settings && typeof settings.lang === "string") {
      await client.query(
        `INSERT INTO app_settings (key, value) VALUES ('lang', $1)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [settings.lang]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  } finally {
    client.release();
  }

  return NextResponse.json({ ok: true, imported: days.length });
}
