"use client";

import { useEffect, useState } from "react";
import { BookOpen, Quote as QuoteIcon } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { Book, Quote } from "@/lib/types";

export function BookShelf() {
  const { t } = useI18n();
  const [books, setBooks] = useState<Book[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((res) => {
        setBooks(res.books ?? []);
        setQuotes(res.quotes ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-24 rounded-lg bg-border/40 animate-pulse" />;
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <div className="h-12 w-12 rounded-full bg-border/40 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-muted" />
        </div>
        <p className="text-sm text-muted">{t("noBooksYet")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {books.map((book) => {
        const bookQuotes = quotes.filter((q) => q.book_id === book.id);
        const pct = book.total_pages ? Math.min(100, Math.round((book.current_page / book.total_pages) * 100)) : null;
        return (
          <div key={book.id} className="card-base p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {book.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.cover_url} alt={book.title} className="h-16 w-12 rounded object-cover border border-border shrink-0" />
              ) : (
                <div className="h-16 w-12 rounded bg-border/40 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-muted" />
                </div>
              )}
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-sm font-semibold text-ink leading-tight">{book.title}</p>
                {book.author && <p className="text-xs text-muted">{book.author}</p>}
                {pct !== null && (
                  <div className="h-1.5 w-full rounded-full bg-border overflow-hidden mt-1">
                    <div className="h-full bg-steel transition-all" style={{ width: `${pct}%` }} />
                  </div>
                )}
                <p className="text-[11px] num text-muted">
                  {book.current_page}
                  {book.total_pages ? ` / ${book.total_pages}` : ""} {t("pages")}
                  {book.status === "finished" ? ` · ${t("bookFinished")}` : ""}
                </p>
              </div>
            </div>
            {bookQuotes.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {bookQuotes.map((q) => (
                  <div key={q.id} className="flex items-start gap-1.5 rounded-xl bg-bg border border-border px-2.5 py-2">
                    <QuoteIcon className="h-3 w-3 text-muted shrink-0 mt-0.5" />
                    <p className="text-xs text-ink italic leading-snug">
                      "{q.text}"{q.page ? <span className="text-muted not-italic"> · p.{q.page}</span> : null}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
