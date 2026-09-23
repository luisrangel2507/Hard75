"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Plus, Ruler, Scale } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { PhotoSlot } from "@/components/PhotoSlot";
import { useDebouncedCallback } from "@/lib/useDebounce";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg, round1, UnitSystem } from "@/lib/units";
import { Book } from "@/lib/types";

export function ProfileForm() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [units, setUnitsState] = useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [startingWeightKg, setStartingWeightKg] = useState("");
  const [heightFeetInput, setHeightFeetInput] = useState("");
  const [heightInchesInput, setHeightInchesInput] = useState("");
  const [weightLbsInput, setWeightLbsInput] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [newBook, setNewBook] = useState<{ title: string; author: string; totalPages: string; coverUrl: string | null } | null>(
    null
  );
  const pendingPatch = useRef<Record<string, number | string>>({});

  useEffect(() => {
    Promise.all([
      fetchWithTimeout("/api/settings").then((r) => r.json()),
      fetchWithTimeout("/api/books").then((r) => r.json()),
    ])
      .then(([settingsRes, booksRes]) => {
        const cm = settingsRes.heightCm ? String(settingsRes.heightCm) : "";
        const kg = settingsRes.startingWeightKg ? String(settingsRes.startingWeightKg) : "";
        setHeightCm(cm);
        setStartingWeightKg(kg);
        if (cm) {
          const { feet, inches } = cmToFeetInches(Number(cm));
          setHeightFeetInput(String(feet));
          setHeightInchesInput(String(inches));
        }
        if (kg) setWeightLbsInput(String(round1(kgToLbs(Number(kg)))));
        setUnitsState(settingsRes.units === "imperial" ? "imperial" : "metric");
        setActiveBookId(settingsRes.activeBookId ?? booksRes.books?.[0]?.id ?? null);
        setBooks(booksRes.books ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  const debouncedSave = useDebouncedCallback(async () => {
    const patch = pendingPatch.current;
    pendingPatch.current = {};
    if (Object.keys(patch).length === 0) return;
    setSaveStatus("saving");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaveStatus(res.ok ? "saved" : "idle");
  }, 500);

  function handleUnitsChange(next: UnitSystem) {
    if (next === "imperial") {
      if (heightCm) {
        const { feet, inches } = cmToFeetInches(Number(heightCm));
        setHeightFeetInput(String(feet));
        setHeightInchesInput(String(inches));
      }
      if (startingWeightKg) setWeightLbsInput(String(round1(kgToLbs(Number(startingWeightKg)))));
    }
    setUnitsState(next);
    pendingPatch.current.units = next;
    debouncedSave();
  }

  function handleHeightChange(value: string) {
    const cleaned = value.replace(/[^\d]/g, "");
    setHeightCm(cleaned);
    if (cleaned) {
      pendingPatch.current.heightCm = Number(cleaned);
      debouncedSave();
    }
  }

  function handleFeetChange(value: string) {
    const cleaned = value.replace(/\D/g, "");
    setHeightFeetInput(cleaned);
    const feet = Number(cleaned) || 0;
    const inches = Number(heightInchesInput) || 0;
    if (!feet && !inches) return;
    const cm = Math.round(feetInchesToCm(feet, inches));
    setHeightCm(String(cm));
    pendingPatch.current.heightCm = cm;
    debouncedSave();
  }

  function handleInchesChange(value: string) {
    const cleaned = value.replace(/\D/g, "");
    setHeightInchesInput(cleaned);
    const inches = Number(cleaned) || 0;
    const feet = Number(heightFeetInput) || 0;
    if (!feet && !inches) return;
    const cm = Math.round(feetInchesToCm(feet, inches));
    setHeightCm(String(cm));
    pendingPatch.current.heightCm = cm;
    debouncedSave();
  }

  function handleWeightChange(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "");
    setStartingWeightKg(cleaned);
    if (cleaned) {
      pendingPatch.current.startingWeightKg = Number(cleaned);
      debouncedSave();
    }
  }

  function handleWeightLbsChange(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "");
    setWeightLbsInput(cleaned);
    if (!cleaned) return;
    const kg = round1(lbsToKg(Number(cleaned)));
    setStartingWeightKg(String(kg));
    pendingPatch.current.startingWeightKg = kg;
    debouncedSave();
  }

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

  async function updateTotalPages(totalPages: string) {
    if (!activeBook) return;
    const value = totalPages ? Number(totalPages) : null;
    const res = await fetch(`/api/books/${activeBook.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total_pages: value }),
    });
    if (res.ok) {
      const { book } = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
    }
  }

  const activeBook = books.find((b) => b.id === activeBookId) ?? null;

  if (loading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        <div className="h-24 rounded-2xl bg-border/40" />
        <div className="h-24 rounded-2xl bg-border/40" />
        <div className="h-40 rounded-2xl bg-border/40" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="card-base p-5 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-ink font-semibold">{t("loadErrorTitle")}</p>
        <p className="text-xs text-muted">{t("loadErrorMessage")}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-xl border border-brass/40 bg-brass/10 px-4 py-2 text-xs uppercase tracking-wide font-semibold text-brass hover:brightness-110 transition active:scale-95"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between -mb-2">
        <div className="flex rounded-full border border-border p-0.5 bg-card">
          <button
            type="button"
            onClick={() => handleUnitsChange("metric")}
            className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wide font-semibold transition active:scale-95 ${
              units === "metric" ? "bg-gradient-to-r from-brass to-ember text-white" : "text-muted"
            }`}
          >
            {t("metric")}
          </button>
          <button
            type="button"
            onClick={() => handleUnitsChange("imperial")}
            className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wide font-semibold transition active:scale-95 ${
              units === "imperial" ? "bg-gradient-to-r from-brass to-ember text-white" : "text-muted"
            }`}
          >
            {t("imperial")}
          </button>
        </div>
        <span className="text-[11px] uppercase tracking-wide text-muted">
          {saveStatus === "saving" ? t("saving") : saveStatus === "saved" ? t("profileSaved") : ""}
        </span>
      </div>

      <div className="card-base p-4 flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-olive/15 text-olive flex items-center justify-center shrink-0">
          <Ruler className="h-4 w-4" />
        </span>
        <div className="flex-1 flex flex-col gap-1">
          <span className="label-caps">{t("height")}</span>
          {units === "metric" ? (
            <div className="flex items-center gap-2">
              <input
                value={heightCm}
                onChange={(e) => handleHeightChange(e.target.value)}
                placeholder={t("heightPlaceholder")}
                inputMode="numeric"
                className="num w-24 bg-bg border border-border rounded-xl px-3 py-2 text-ink text-lg focus:outline-none focus:border-olive"
              />
              <span className="text-sm text-muted">cm</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={heightFeetInput}
                onChange={(e) => handleFeetChange(e.target.value)}
                placeholder="5"
                inputMode="numeric"
                className="num w-16 bg-bg border border-border rounded-xl px-3 py-2 text-ink text-lg focus:outline-none focus:border-olive"
              />
              <span className="text-sm text-muted">{t("ft")}</span>
              <input
                value={heightInchesInput}
                onChange={(e) => handleInchesChange(e.target.value)}
                placeholder="10"
                inputMode="numeric"
                className="num w-16 bg-bg border border-border rounded-xl px-3 py-2 text-ink text-lg focus:outline-none focus:border-olive"
              />
              <span className="text-sm text-muted">{t("in")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-base p-4 flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-brass/15 text-brass flex items-center justify-center shrink-0">
          <Scale className="h-4 w-4" />
        </span>
        <div className="flex-1 flex flex-col gap-1">
          <span className="label-caps">{t("startingWeight")}</span>
          <div className="flex items-center gap-2">
            <input
              value={units === "metric" ? startingWeightKg : weightLbsInput}
              onChange={(e) => (units === "metric" ? handleWeightChange(e.target.value) : handleWeightLbsChange(e.target.value))}
              placeholder={t("startingWeightPlaceholder")}
              inputMode="decimal"
              className="num w-24 bg-bg border border-border rounded-xl px-3 py-2 text-ink text-lg focus:outline-none focus:border-brass"
            />
            <span className="text-sm text-muted">{units === "metric" ? t("kg") : t("lbs")}</span>
          </div>
        </div>
      </div>

      <div className="card-base p-4 flex flex-col gap-3">
        <span className="flex items-center gap-2 label-caps">
          <span className="h-7 w-7 rounded-full bg-steel/15 text-steel flex items-center justify-center">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          {t("currentBook")}
        </span>

        {newBook ? (
          <div className="flex flex-col gap-2">
            <input
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              placeholder={t("bookTitle")}
              className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-steel"
            />
            <div className="flex gap-2">
              <input
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                placeholder={t("bookAuthor")}
                className="flex-1 bg-bg border border-border rounded-xl px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-steel"
              />
              <input
                value={newBook.totalPages}
                onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value.replace(/\D/g, "") })}
                placeholder={t("bookPages")}
                inputMode="numeric"
                className="w-24 bg-bg border border-border rounded-xl px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-steel"
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
                className="flex-1 rounded-xl border border-border py-2 text-xs uppercase tracking-wide font-semibold text-muted hover:text-ink transition active:scale-95"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={createBook}
                className="flex-1 rounded-xl border border-steel/40 bg-steel/10 py-2 text-xs uppercase tracking-wide font-semibold text-steel hover:brightness-110 transition active:scale-95"
              >
                {t("save")}
              </button>
            </div>
          </div>
        ) : !activeBook ? (
          <button
            type="button"
            onClick={() => setNewBook({ title: "", author: "", totalPages: "", coverUrl: null })}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-xs uppercase tracking-wide font-semibold text-muted hover:text-steel hover:border-steel/50 transition active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> {t("addFirstBook")}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {activeBook.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeBook.cover_url}
                  alt={activeBook.title}
                  className="h-16 w-12 rounded object-cover border border-border shrink-0"
                />
              ) : (
                <div className="h-16 w-12 rounded bg-border/40 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-muted" />
                </div>
              )}
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-sm font-semibold text-ink leading-tight">{activeBook.title}</p>
                {activeBook.author && <p className="text-xs text-muted">{activeBook.author}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    defaultValue={activeBook.total_pages ?? ""}
                    onBlur={(e) => updateTotalPages(e.target.value.replace(/\D/g, ""))}
                    placeholder={t("bookPages")}
                    inputMode="numeric"
                    className="num w-20 bg-bg border border-border rounded-xl px-2 py-1 text-xs text-ink placeholder:text-muted focus:outline-none focus:border-steel"
                  />
                  <span className="text-[11px] text-muted">{t("bookPages")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {books.length > 1 && (
                <select
                  value={activeBookId ?? ""}
                  onChange={(e) => setActiveBook(e.target.value)}
                  className="flex-1 bg-bg border border-border rounded-xl px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-steel"
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border text-xs uppercase tracking-wide font-semibold text-muted hover:text-steel hover:border-steel/50 transition active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" /> {t("changeBook")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
