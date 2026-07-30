import { NextRequest, NextResponse } from "next/server";
import { createUploadUrl, deleteObjectByUrl, photoKey } from "@/lib/storage";
import { query } from "@/lib/db";
import { PhotoSlotKey, TOTAL_DAYS } from "@/lib/types";

export const dynamic = "force-dynamic";

const SLOT_COLUMN: Record<string, PhotoSlotKey> = {
  progress: "progress_photo_url",
  breakfast: "breakfast_photo_url",
  lunch: "lunch_photo_url",
  dinner: "dinner_photo_url",
};

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const dayNumber = Number(body?.dayNumber);
  const slot = body?.slot as string;
  const contentType = (body?.contentType as string) || "image/jpeg";

  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    return NextResponse.json({ error: "invalid dayNumber" }, { status: 400 });
  }
  const column = SLOT_COLUMN[slot];
  if (!column) {
    return NextResponse.json({ error: "invalid slot" }, { status: 400 });
  }
  const ext = EXT_BY_CONTENT_TYPE[contentType] ?? "jpg";

  try {
    const key = photoKey(dayNumber, slot, ext);
    const { uploadUrl, publicUrl } = await createUploadUrl(key, contentType);
    return NextResponse.json({ uploadUrl, publicUrl, column });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const dayNumber = Number(body?.dayNumber);
  const slot = body?.slot as string;

  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    return NextResponse.json({ error: "invalid dayNumber" }, { status: 400 });
  }
  const column = SLOT_COLUMN[slot];
  if (!column) {
    return NextResponse.json({ error: "invalid slot" }, { status: 400 });
  }

  const rows = await query<Record<string, string | null>>(
    `SELECT ${column} FROM challenge_days WHERE day_number = $1`,
    [dayNumber]
  );
  const url = rows[0]?.[column];

  if (url) {
    try {
      await deleteObjectByUrl(url);
    } catch {
      // best-effort deletion; continue clearing the DB reference
    }
  }

  await query(
    `INSERT INTO challenge_days (day_number, ${column}) VALUES ($1, NULL)
     ON CONFLICT (day_number) DO UPDATE SET ${column} = NULL, updated_at = now()`,
    [dayNumber]
  );

  return NextResponse.json({ ok: true, column });
}
