"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Quote as QuoteIcon, Trash2 } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Book, Quote } from "@/lib/types";

export function ReadingCard({
  checked,
  onToggle,
  onPagesLogged,
}: {
  checked: boolean;
  onToggle: (next: boolean) => void;
  onPagesLogged: () => void;
}) {
  const { t } = useI18n();
  const [books, setBooks] = useState<Book[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagesInput, setPagesInput] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [quotePage, setQuotePage] = useState("");
  const [newBook, setNewBook] = useState<{ title: string; author: string; totalPages: string; coverUrl: string | null } | null>(
    null
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/books").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]).then(([booksRes, settingsRes]) => {
      setBooks(booksRes.books ?? []);
      setQuotes(booksRes.quotes ?? []);
      const active = settingsRes.activeBookId;
      const fallback = booksRes.books?.[0]?.id ?? null;
      setActiveBookId(active && booksRes.books?.some((b: Book) => b.id === active) ? active : fallback);
      setLoading(false);
    });
  }, []);

  const activeBook = books.find((b) => b.id === activeBookId) ?? null;
  const bookQuotes = quotes.filter((q) => q.book_id === activeBookId).slice(-3).reverse();

  function setActiveBook(id: string) {
    setActiveBookId(id);
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeBookId: id }),
    }).catch(() => {});
  }

  async function createBook() {
    if (!newBook || !newBook.title.trim()) return;
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newBook.title.trim(),
        author: newBook.author.trim() || null,
        total_pages: newBook.totalPages ? Number(newBook.totalPages) : null,
        cover_url: newBook.coverUrl,
      }),
    });
    if (res.ok) {
      const { book } = await res.json();
      setBooks((prev) => [...prev, book]);
      setActiveBook(book.id);
      setNewBook(null);
    }
  }

  async function addPages() {
    const pages = Number(pagesInput);
    if (!activeBook || !pages || pages <= 0) return;
    const nextPage = activeBook.current_page + pages;
    const res = await fetch(`/api/books/${activeBook.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_page: nextPage }),
    });
    if (res.ok) {
      const { book } = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
      setPagesInput("");
      onPagesLogged();
      if (!checked) onToggle(true);
    }
  }

  async function addQuote() {
    if (!activeBook || !quoteText.trim()) return;
    const res = await fetch(`/api/books/${activeBook.id}/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: quoteText.trim(), page: quotePage ? Number(quotePage) : null }),
    });
    if (res.ok) {
      const { quote } = await res.json();
      setQuotes((prev) => [...prev, quote]);
      setQuoteText("");
      setQuotePage("");
    }
  }

  async function removeQuote(id: string) {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
  }

  const pct = activeBook?.total_pages
    ? Math.min(100, Math.round((activeBook.current_page / activeBook.total_pages) * 100))
    : null;

  return (
    <div className={`w-full rounded-lg border px-4 py-3.5 flex flex-col gap-3 transition ${checked ? "border-steel bg-steel/10" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onToggle(!checked)} className="flex items-center gap-3 active:scale-[0.97] transition-transform">
          <BookOpen className={`h-4 w-4 ${checked ? "text-steel" : "text-muted"}`} />
          <span className={`label-caps ${checked ? "text-ink" : ""}`}>{t("book")}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggle(!checked)}
          className={`h-5 w-9 rounded-full relative transition-colors active:scale-95 ${checked ? "bg-steel" : "bg-border"}`}
        >
          <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${checked ? "translate-x-4" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="h-16 rounded-md bg-border/40 animate-pulse" />
      ) : newBook ? (
        <div className="flex flex-col gap-2">
          <input
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            placeholder={t("bookTitle")}
            className="bg-bg border border-border rounded-md px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-steel"
          />
          <div className="flex gap-2">
            <input
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              placeholder={t("bookAuthor")}
              className="flex-1 bg-bg border border-border rounded-md px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-steel"
            />
            <input
              value={newBook.totalPages}
              onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value.replace(/\D/g, "") })}
              placeholder={t("bookPages")}
              inputMode="numeric"
              className="w-24 bg-bg border border-border rounded-md px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-steel"
            />
          </div>
          <PhotoSlot
            label={t("bookCover")}
            currentUrl={newBook.coverUrl}
            onChange={(url) => setNewBook({ ...newBook, coverUrl: url })}
            aspect="portrait"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewBook(null)}
              className="flex-1 rounded-md border border-border py-2 text-xs uppercase tracking-wide font-semibold text-muted hover:text-ink transition active:scale-95"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={createBook}
              className="flex-1 rounded-md border border-steel/40 bg-steel/10 py-2 text-xs uppercase tracking-wide font-semibold text-steel hover:brightness-110 transition active:scale-95"
            >
              {t("save")}
            </button>
          </div>
        </div>
      ) : !activeBook ? (
        <button
          type="button"
          onClick={() => setNewBook({ title: "", author: "", totalPages: "", coverUrl: null })}
          className="flex items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-xs uppercase tracking-wide font-semibold text-muted hover:text-steel hover:border-steel/50 transition active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" /> {t("addFirstBook")}
        </button>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {books.length > 1 && (
              <select
                value={activeBookId ?? ""}
                onChange={(e) => setActiveBook(e.target.value)}
                className="flex-1 bg-bg border border-border rounded-md px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-steel"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => setNewBook({ title: "", author: "", totalPages: "", coverUrl: null })}
              className="p-1.5 rounded-md border border-border text-muted hover:text-steel transition active:scale-90"
              title={t("addFirstBook")}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeBook.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeBook.cover_url} alt={activeBook.title} className="h-16 w-12 rounded object-cover border border-border shrink-0" />
            ) : (
              <div className="h-16 w-12 rounded bg-border/40 flex items-center justify-center shrink-0">
                <BookOpen className="h-4 w-4 text-muted" />
              </div>
            )}
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-sm font-semibold text-ink leading-tight">{activeBook.title}</p>
              {activeBook.author && <p className="text-xs text-muted">{activeBook.author}</p>}
              {pct !== null && (
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden mt-1">
                  <div className="h-full bg-steel transition-all" style={{ width: `${pct}%` }} />
                </div>
              )}
              <p className="text-[11px] num text-muted">
                {activeBook.current_page}
                {activeBook.total_pages ? ` / ${activeBook.total_pages}` : ""} {t("pages")}
                {activeBook.status === "finished" ? ` · ${t("bookFinished")}` : ""}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value.replace(/\D/g, ""))}
              placeholder={t("pagesReadToday")}
              inputMode="numeric"
              className="flex-1 num bg-bg border border-border rounded-md px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-steel"
            />
            <button
              type="button"
              onClick={addPages}
              className="rounded-md border border-steel/40 bg-steel/10 px-3 py-2 text-xs uppercase tracking-wide font-semibold text-steel hover:brightness-110 transition active:scale-95"
            >
              {t("logPages")}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold text-muted">
              <QuoteIcon className="h-3 w-3" /> {t("quotes")}
            </span>
            {bookQuotes.length === 0 ? (
              <p className="text-xs text-muted">{t("noQuotesYet")}</p>
            ) : (
              bookQuotes.map((q) => (
                <div key={q.id} className="flex items-start justify-between gap-2 rounded-md bg-bg border border-border px-2.5 py-2">
                  <p className="text-xs text-ink italic leading-snug">
                    "{q.text}"{q.page ? <span className="text-muted not-italic"> · p.{q.page}</span> : null}
                  </p>
                  <button type="button" onClick={() => removeQuote(q.id)} className="text-muted hover:text-ember transition shrink-0">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
            <div className="flex gap-2 mt-1">
              <input
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder={t("quotePlaceholder")}
                className="flex-1 bg-bg border border-border rounded-md px-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-steel"
              />
              <input
                value={quotePage}
                onChange={(e) => setQuotePage(e.target.value.replace(/\D/g, ""))}
                placeholder={t("page")}
                inputMode="numeric"
                className="w-16 num bg-bg border border-border rounded-md px-2 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-steel"
              />
              <button
                type="button"
                onClick={addQuote}
                className="p-2 rounded-md border border-steel/40 bg-steel/10 text-steel hover:brightness-110 transition active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
