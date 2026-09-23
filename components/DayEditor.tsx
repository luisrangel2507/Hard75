"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Dumbbell, Bike, Wine } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WorkoutCard } from "@/components/WorkoutCard";
import { ReadingCard } from "@/components/ReadingCard";
import { WaterTracker } from "@/components/WaterTracker";
import { WeightInput } from "@/components/WeightInput";
import { PhotoSlot } from "@/components/PhotoSlot";
import { useDebouncedCallback } from "@/lib/useDebounce";
import { celebrate } from "@/lib/celebrate";
import { isAchievementUnlock } from "@/lib/achievements";
import { ChallengeDay, defaultDay, INDOOR_TYPES, OUTDOOR_TYPES, PhotoSlotKey, TOTAL_DAYS } from "@/lib/types";
import { buildDaysMap, computeStreak, isDayComplete, weightTrend } from "@/lib/challenge";

export function DayEditor({
  initialDays,
  dayNumber,
}: {
  initialDays: ChallengeDay[];
  dayNumber: number;
}) {
  const { t } = useI18n();
  const router = useRouter();

  const [daysMap, setDaysMap] = useState(() => buildDaysMap(initialDays));
  const [day, setDay] = useState<ChallengeDay>(
    () => initialDays.find((d) => d.day_number === dayNumber) ?? defaultDay(dayNumber)
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const pendingPatch = useRef<Partial<ChallengeDay>>({});
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, []);

  const trendMap = useMemo(() => {
    const m = new Map(daysMap);
    m.set(dayNumber, day);
    return m;
  }, [daysMap, day, dayNumber]);

  const { trend, delta, previousDay } = weightTrend(trendMap, dayNumber);

  const debouncedSave = useDebouncedCallback(async () => {
    const patch = pendingPatch.current;
    pendingPatch.current = {};
    if (Object.keys(patch).length === 0) return;
    await persist(patch);
  }, 400);

  async function persist(patch: Partial<ChallengeDay>) {
    setSaveStatus("saving");
    const wasComplete = isDayComplete(day);
    const streakBefore = computeStreak(daysMap);
    try {
      const res = await fetch(`/api/days/${dayNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const { day: updated } = await res.json();
        setDay(updated);
        setDaysMap((prev) => {
          const next = new Map(prev);
          next.set(dayNumber, updated);
          const streakAfter = computeStreak(next);
          if ((!wasComplete && isDayComplete(updated)) || isAchievementUnlock(streakBefore, streakAfter)) {
            celebrate();
          }
          return next;
        });
        setSaveStatus("saved");
      } else {
        handleSaveFailure(patch);
      }
    } catch {
      handleSaveFailure(patch);
    }
  }

  function handleSaveFailure(patch: Partial<ChallengeDay>) {
    setSaveStatus("error");
    // keep newer edits (already queued) ahead of the failed patch, then retry shortly
    pendingPatch.current = { ...patch, ...pendingPatch.current };
    if (retryTimeout.current) clearTimeout(retryTimeout.current);
    retryTimeout.current = setTimeout(() => {
      const retryPatch = pendingPatch.current;
      pendingPatch.current = {};
      if (Object.keys(retryPatch).length > 0) persist(retryPatch);
    }, 4000);
  }

  function updateField<K extends keyof ChallengeDay>(key: K, value: ChallengeDay[K]) {
    setDay((prev) => ({ ...prev, [key]: value }));
    pendingPatch.current[key] = value;
    debouncedSave();
  }

  function handlePhotoChange(column: PhotoSlotKey, url: string | null) {
    setDay((prev) => ({ ...prev, [column]: url }));
    persist({ [column]: url } as Partial<ChallengeDay>);
  }

  const complete = isDayComplete(day);
  const prevDisabled = dayNumber <= 1;
  const nextDisabled = !complete || dayNumber >= TOTAL_DAYS;

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => router.push(`/day/${dayNumber - 1}`)}
          className="p-2.5 rounded-full border border-border bg-card text-muted hover:text-ink active:scale-90 disabled:opacity-30 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-center">
          <p className="label-caps">{t("day")}</p>
          <p className="num text-2xl font-bold text-ink">
            {dayNumber}
            <span className="text-base text-muted">/{TOTAL_DAYS}</span>
          </p>
        </div>

        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => router.push(`/day/${dayNumber + 1}`)}
          className="p-2.5 rounded-full border border-border bg-card text-muted hover:text-ink active:scale-90 disabled:opacity-30 transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-end -mt-3">
        <span
          className={`text-[11px] uppercase tracking-wide ${saveStatus === "error" ? "text-ember font-semibold" : "text-muted"}`}
        >
          {saveStatus === "saving"
            ? t("saving")
            : saveStatus === "saved"
              ? t("saved")
              : saveStatus === "error"
                ? t("saveError")
                : ""}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <WorkoutCard
          icon={Dumbbell}
          label={t("indoorWorkout")}
          checked={day.indoor_workout}
          accent="ember"
          types={INDOOR_TYPES}
          typeValue={day.indoor_type}
          customValue={day.indoor_type_custom}
          onToggle={(v) => updateField("indoor_workout", v)}
          onTypeChange={(v) => updateField("indoor_type", v)}
          onCustomChange={(v) => updateField("indoor_type_custom", v)}
          onTimerComplete={() => updateField("indoor_workout", true)}
        />
        <WorkoutCard
          icon={Bike}
          label={t("outdoorWorkout")}
          checked={day.outdoor_workout}
          accent="olive"
          types={OUTDOOR_TYPES}
          typeValue={day.outdoor_type}
          customValue={day.outdoor_type_custom}
          onToggle={(v) => updateField("outdoor_workout", v)}
          onTypeChange={(v) => updateField("outdoor_type", v)}
          onCustomChange={(v) => updateField("outdoor_type_custom", v)}
          onTimerComplete={() => updateField("outdoor_workout", true)}
        />
        <ReadingCard
          checked={day.book}
          onToggle={(v) => updateField("book", v)}
          onPagesLogged={() => {}}
        />
        <div
          className={`w-full rounded-2xl border px-4 py-3.5 flex flex-col gap-3 transition ${
            day.diet
              ? "border-olive bg-olive/10 shadow-[0_4px_14px_rgba(15,191,160,0.18)]"
              : "border-border bg-card shadow-[0_1px_6px_rgba(40,33,26,0.04)]"
          }`}
        >
          <button
            type="button"
            onClick={() => updateField("diet", !day.diet)}
            className="w-full flex items-center justify-between gap-3 active:scale-[0.97] transition-transform"
          >
            <span className="flex items-center gap-3">
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  day.diet ? "bg-olive text-white" : "bg-border/40 text-muted"
                }`}
              >
                <Wine className="h-4 w-4" />
              </span>
              <span className={`label-caps ${day.diet ? "text-ink" : ""}`}>{t("diet")}</span>
            </span>
            <span className={`h-5 w-9 rounded-full relative transition-colors ${day.diet ? "bg-olive" : "bg-border"}`}>
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
                  day.diet ? "translate-x-4" : ""
                }`}
              />
            </span>
          </button>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-muted">{t("calories")}</span>
            <input
              type="text"
              inputMode="numeric"
              value={day.calories ?? ""}
              onChange={(e) => updateField("calories", e.target.value ? Number(e.target.value.replace(/\D/g, "")) : null)}
              placeholder={t("caloriesPlaceholder")}
              className="num bg-bg border border-border rounded-xl px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-olive"
            />
          </div>
        </div>
      </div>

      <WaterTracker waterMl={day.water_ml} onChange={(v) => updateField("water_ml", v)} />

      <WeightInput
        weightKg={day.weight_kg}
        onChange={(v) => updateField("weight_kg", v)}
        trend={trend}
        delta={delta}
        previousDay={previousDay}
      />

      <PhotoSlot
        label={t("progressPhoto")}
        currentUrl={day.progress_photo_url}
        onChange={(url) => handlePhotoChange("progress_photo_url", url)}
        aspect="portrait"
      />

      <div className="grid grid-cols-3 gap-2.5">
        <PhotoSlot
          label={t("breakfast")}
          currentUrl={day.breakfast_photo_url}
          onChange={(url) => handlePhotoChange("breakfast_photo_url", url)}
        />
        <PhotoSlot
          label={t("lunch")}
          currentUrl={day.lunch_photo_url}
          onChange={(url) => handlePhotoChange("lunch_photo_url", url)}
        />
        <PhotoSlot
          label={t("dinner")}
          currentUrl={day.dinner_photo_url}
          onChange={(url) => handlePhotoChange("dinner_photo_url", url)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="label-caps">{t("notes")}</span>
        <textarea
          value={day.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder={t("notesPlaceholder")}
          rows={4}
          className="bg-card border border-border rounded-2xl px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-brass resize-none"
        />
      </div>
    </>
  );
}
