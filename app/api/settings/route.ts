import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<{ value: string }>("SELECT value FROM app_settings WHERE key = 'lang'");
  return NextResponse.json({ lang: rows[0]?.value ?? "es" });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const lang = body?.lang;
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
