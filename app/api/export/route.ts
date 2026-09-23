import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Book, ChallengeDay, Quote } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const days = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  const settingsRows = await query<{ key: string; value: string }>("SELECT key, value FROM app_settings");
  const settings = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));
  const books = await query<Book>("SELECT * FROM books ORDER BY created_at ASC");
  const quotes = await query<Quote>("SELECT * FROM quotes ORDER BY created_at ASC");

  const payload = {
    exportedAt: new Date().toISOString(),
    version: 2,
    settings,
    days,
    books,
    quotes,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="fit-for-75-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
