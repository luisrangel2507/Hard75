import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Book } from "@/lib/types";

export const dynamic = "force-dynamic";

const EDITABLE_FIELDS = ["title", "author", "total_pages", "current_page", "cover_url", "status"] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const existingRows = await query<Book>("SELECT * FROM books WHERE id = $1", [params.id]);
  const existing = existingRows[0];
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const merged: Book = { ...existing };
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      (merged as unknown as Record<string, unknown>)[field] = body[field];
    }
  }
  if (merged.total_pages != null && merged.current_page >= merged.total_pages) {
    merged.status = "finished";
  }

  const rows = await query<Book>(
    `UPDATE books SET title = $1, author = $2, total_pages = $3, current_page = $4, cover_url = $5, status = $6
     WHERE id = $7 RETURNING *`,
    [merged.title, merged.author, merged.total_pages, merged.current_page, merged.cover_url, merged.status, params.id]
  );
  return NextResponse.json({ book: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await query("DELETE FROM books WHERE id = $1", [params.id]);
  return NextResponse.json({ ok: true });
}
