import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Book, Quote } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const books = await query<Book>("SELECT * FROM books ORDER BY created_at ASC");
  const quotes = await query<Quote>("SELECT * FROM quotes ORDER BY created_at ASC");
  return NextResponse.json({ books, quotes });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const title = body?.title;
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const author = typeof body?.author === "string" ? body.author : null;
  const totalPages = typeof body?.total_pages === "number" ? body.total_pages : null;
  const coverUrl = typeof body?.cover_url === "string" ? body.cover_url : null;

  const id = crypto.randomUUID();
  const rows = await query<Book>(
    `INSERT INTO books (id, title, author, total_pages, cover_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [id, title.trim(), author, totalPages, coverUrl]
  );
  return NextResponse.json({ book: rows[0] });
}
