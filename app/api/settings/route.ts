import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<{ key: string; value: string }>(
    "SELECT key, value FROM app_settings WHERE key IN ('lang', 'active_book_id')"
  );
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({ lang: map.lang ?? "es", activeBookId: map.active_book_id ?? null });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if ("lang" in (body ?? {})) {
    const lang = body.lang;
    if (lang !== "es" && lang !== "en") {
      return NextResponse.json({ error: "invalid lang" }, { status: 400 });
    }
    await query(
      `INSERT INTO app_settings (key, value) VALUES ('lang', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [lang]
    );
    return NextResponse.json({ ok: true, lang });
  }

  if ("activeBookId" in (body ?? {})) {
    const activeBookId = body.activeBookId;
    if (typeof activeBookId !== "string") {
      return NextResponse.json({ error: "invalid activeBookId" }, { status: 400 });
    }
    await query(
      `INSERT INTO app_settings (key, value) VALUES ('active_book_id', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [activeBookId]
    );
    return NextResponse.json({ ok: true, activeBookId });
  }

  return NextResponse.json({ error: "invalid payload" }, { status: 400 });
}
