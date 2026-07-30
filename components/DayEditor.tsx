"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Dumbbell, Bike, BookOpen, Wine } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { TaskToggle } from "@/components/TaskToggle";
import { WaterTracker } from "@/components/WaterTracker";
import { WeightInput } from "@/components/WeightInput";
import { PhotoSlot } from "@/components/PhotoSlot";
import { useDebouncedCallback } from "@/lib/useDebounce";
import { ChallengeDay, defaultDay, PhotoSlotKey, TOTAL_DAYS } from "@/lib/types";
import { buildDaysMap, isDayComplete, weightTrend } from "@/lib/challenge";

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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const pendingPatch = useRef<Partial<ChallengeDay>>({});

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
          return next;
        });
        setSaveStatus("saved");
      }
    } catch {
      // best-effort; leave status as-is
    }
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
          className="p-2 rounded-md border border-border text-muted hover:text-ink disabled:opacity-30 transition"
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
          className="p-2 rounded-md border border-border text-muted hover:text-ink disabled:opacity-30 transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-end -mt-3">
        <span className="text-[11px] uppercase tracking-wide text-muted">
          {saveStatus === "saving" ? t("saving") : saveStatus === "saved" ? t("saved") : ""}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <TaskToggle
          icon={Dumbbell}
          label={t("indoorWorkout")}
          checked={day.indoor_workout}
          accent="ember"
          onChange={(v) => updateField("indoor_workout", v)}
        />
        <TaskToggle
          icon={Bike}
          label={t("outdoorWorkout")}
          checked={day.outdoor_workout}
          accent="olive"
          onChange={(v) => updateField("outdoor_workout", v)}
        />
        <TaskToggle
          icon={BookOpen}
          label={t("book")}
          checked={day.book}
          accent="steel"
          onChange={(v) => updateField("book", v)}
        />
        <TaskToggle
          icon={Wine}
          label={t("diet")}
          checked={day.diet}
          accent="olive"
          onChange={(v) => updateField("diet", v)}
        />
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
          className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-brass resize-none"
        />
      </div>
    </>
  );
}
