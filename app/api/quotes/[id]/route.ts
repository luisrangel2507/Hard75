import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await query("DELETE FROM quotes WHERE id = $1", [params.id]);
  return NextResponse.json({ ok: true });
}
