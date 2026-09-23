import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Quote } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const text = body?.text;
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const page = typeof body?.page === "number" ? body.page : null;

  try {
    const id = crypto.randomUUID();
    const rows = await query<Quote>(
      `INSERT INTO quotes (id, book_id, text, page) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, params.id, text.trim(), page]
    );
    return NextResponse.json({ quote: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
