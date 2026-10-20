import { NextResponse } from "next/server";
import { getPool, query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await query("SELECT 1");
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM quotes");
      await client.query("DELETE FROM books");
      await client.query("DELETE FROM challenge_days");
      await client.query("DELETE FROM app_settings WHERE key IN ('active_book_id', 'height_cm', 'starting_weight_kg')");
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
