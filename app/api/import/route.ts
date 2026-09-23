import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { Book, ChallengeDay, Quote, TOTAL_DAYS } from "@/lib/types";

export const dynamic = "force-dynamic";

const EDITABLE_FIELDS = [
  "day_number",
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

const BOOK_FIELDS = ["id", "title", "author", "total_pages", "current_page", "cover_url", "status"] as const;
const QUOTE_FIELDS = ["id", "book_id", "text", "page"] as const;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const days = body?.days as ChallengeDay[] | undefined;
  const settings = body?.settings as Record<string, string> | undefined;
  const books = body?.books as Book[] | undefined;
  const quotes = body?.quotes as Quote[] | undefined;

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

  const client = await getPool().connect();
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

    if (Array.isArray(books)) {
      await client.query("DELETE FROM quotes");
      await client.query("DELETE FROM books");
      for (const b of books) {
        const values = BOOK_FIELDS.map((f) => (b as unknown as Record<string, unknown>)[f] ?? null);
        const placeholders = BOOK_FIELDS.map((_, i) => `$${i + 1}`).join(", ");
        await client.query(`INSERT INTO books (${BOOK_FIELDS.join(", ")}) VALUES (${placeholders})`, values);
      }
      if (Array.isArray(quotes)) {
        for (const q of quotes) {
          const values = QUOTE_FIELDS.map((f) => (q as unknown as Record<string, unknown>)[f] ?? null);
          const placeholders = QUOTE_FIELDS.map((_, i) => `$${i + 1}`).join(", ");
          await client.query(`INSERT INTO quotes (${QUOTE_FIELDS.join(", ")}) VALUES (${placeholders})`, values);
        }
      }
    }

    if (settings && typeof settings.active_book_id === "string") {
      await client.query(
        `INSERT INTO app_settings (key, value) VALUES ('active_book_id', $1)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [settings.active_book_id]
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
