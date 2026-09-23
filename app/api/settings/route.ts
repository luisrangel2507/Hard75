import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const FIELD_MAP = {
  lang: "lang",
  activeBookId: "active_book_id",
  heightCm: "height_cm",
  startingWeightKg: "starting_weight_kg",
  units: "units",
} as const;

type FieldKey = keyof typeof FIELD_MAP;

function validate(field: FieldKey, value: unknown): string | null {
  if (field === "lang") return value === "es" || value === "en" ? String(value) : null;
  if (field === "activeBookId") return typeof value === "string" ? value : null;
  if (field === "heightCm" || field === "startingWeightKg") {
    return typeof value === "number" && value > 0 ? String(value) : null;
  }
  if (field === "units") return value === "metric" || value === "imperial" ? String(value) : null;
  return null;
}

export async function GET() {
  try {
    const rows = await query<{ key: string; value: string }>(
      `SELECT key, value FROM app_settings WHERE key IN (${Object.values(FIELD_MAP)
        .map((_, i) => `$${i + 1}`)
        .join(", ")})`,
      Object.values(FIELD_MAP)
    );
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return NextResponse.json({
      lang: map.lang ?? "es",
      activeBookId: map.active_book_id ?? null,
      heightCm: map.height_cm ? Number(map.height_cm) : null,
      startingWeightKg: map.starting_weight_kg ? Number(map.starting_weight_kg) : null,
      units: map.units === "imperial" ? "imperial" : "metric",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: (err as Error).message,
        lang: "es",
        activeBookId: null,
        heightCm: null,
        startingWeightKg: null,
        units: "metric",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  for (const field of Object.keys(FIELD_MAP) as FieldKey[]) {
    if (field in body) {
      const validated = validate(field, body[field]);
      if (validated === null) {
        return NextResponse.json({ error: `invalid ${field}` }, { status: 400 });
      }
      updates[FIELD_MAP[field]] = validated;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  try {
    for (const [key, value] of Object.entries(updates)) {
      await query(
        `INSERT INTO app_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, value]
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
