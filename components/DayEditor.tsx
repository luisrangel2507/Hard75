"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Bike, Flame, Wine } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { LevelUp } from "@/components/LevelUp";
import { levelFromXp, totalXp } from "@/lib/game";
import { TaskList } from "@/components/TaskList";
import { TodayHero } from "@/components/TodayHero";
import { Switch, TaskCard } from "@/components/TaskCard";
import { QuestBar } from "@/components/QuestBar";
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
  images,
  heroImage,
}: {
  initialDays: ChallengeDay[];
  dayNumber: number;
  images: Record<string, string | null>;
  heroImage: string | null;
}) {
  const { t, lang } = useI18n();
  const router = useRouter();

  const [daysMap, setDaysMap] = useState(() => buildDaysMap(initialDays));
  const [day, setDay] = useState<ChallengeDay>(
    () => initialDays.find((d) => d.day_number === dayNumber) ?? defaultDay(dayNumber)
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const daysRef = useRef(daysMap);
  daysRef.current = daysMap;
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
    const before = daysRef.current;
    const streakBefore = computeStreak(before);
    try {
      const res = await fetch(`/api/days/${dayNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const { day: updated } = await res.json();
        setDay(updated);
        const next = new Map(before);
        next.set(dayNumber, updated);
        setDaysMap(next);
        const streakAfter = computeStreak(next);
        if ((!wasComplete && isDayComplete(updated)) || isAchievementUnlock(streakBefore, streakAfter)) {
          celebrate();
        }
        const levelBefore = levelFromXp(totalXp(Array.from(before.values())));
        const levelAfter = levelFromXp(totalXp(Array.from(next.values())));
        if (levelAfter > levelBefore) setLevelUp(levelAfter);
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

  const statusText =
    saveStatus === "saving" ? t("saving") : saveStatus === "saved" ? t("saved") : saveStatus === "error" ? t("saveError") : "";
  const es = lang === "es";

  return (
    <>
      {levelUp !== null && <LevelUp level={levelUp} onClose={() => setLevelUp(null)} />}

      <TodayHero
        image={heroImage}
        dayNumber={dayNumber}
        onPrev={() => router.push(`/day/${dayNumber - 1}`)}
        onNext={() => router.push(`/day/${dayNumber + 1}`)}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        status={statusText}
        tagline={es ? "Mantén la disciplina" : "Stay disciplined"}
      />

      <div className="flex flex-col gap-3.5">
        <WorkoutCard
          icon={Dumbbell}
          label={t("indoorWorkout")}
          subtitle={es ? "45 minutos" : "45 minutes"}
          checked={day.indoor_workout}
          tone="orange"
          image={images.indoor}
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
          subtitle={es ? "45 minutos" : "45 minutes"}
          checked={day.outdoor_workout}
          tone="green"
          image={images.outdoor}
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
          image={images.reading}
        />
        <TaskCard
          icon={Wine}
          tone="red"
          title={t("diet")}
          subtitle={es ? "Sigue tu plan. Sin comidas trampa." : "Follow your plan. No cheat meals."}
          image={images.diet}
          onHeaderClick={() => updateField("diet", !day.diet)}
          right={<Switch checked={day.diet} onChange={(v) => updateField("diet", v)} label={t("diet")} />}
        >
          <div className="flex items-stretch rounded-2xl border border-white/15 bg-black/30 overflow-hidden w-[88%]">
            <span className="flex items-center gap-2 px-3 py-3 text-sm text-ink/90 whitespace-nowrap border-r border-white/10">
              <Flame className="h-4 w-4 text-brass" />
              {t("calories")}
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={day.calories ?? ""}
              onChange={(e) => updateField("calories", e.target.value ? Number(e.target.value.replace(/\D/g, "")) : null)}
              placeholder={t("caloriesPlaceholder")}
              className="num min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
          </div>
        </TaskCard>

        <div id="task-water" className="scroll-mt-20">
          <WaterTracker waterMl={day.water_ml} onChange={(v) => updateField("water_ml", v)} image={images.water} />
        </div>

        <WeightInput
          weightKg={day.weight_kg}
          onChange={(v) => updateField("weight_kg", v)}
          trend={trend}
          delta={delta}
          previousDay={previousDay}
        />

        <div id="task-photo" className="scroll-mt-20">
          <PhotoSlot
            label={t("progressPhoto")}
            currentUrl={day.progress_photo_url}
            onChange={(url) => handlePhotoChange("progress_photo_url", url)}
            aspect="portrait"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="section-title">{t("notes")}</span>
          <textarea
            value={day.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder={t("notesPlaceholder")}
            rows={4}
            className="bg-card border border-border rounded-2xl px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-brass resize-none"
          />
        </div>

        <QuestBar day={day} />

        <TaskList
          day={day}
          lang={lang}
          onToggle={(field, value) => updateField(field, value)}
          onJump={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />
      </div>
    </>
  );
}
