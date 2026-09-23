"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WORKOUT_TIMER_SECONDS } from "@/lib/types";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function WorkoutTimer({ accentClass, onComplete }: { accentClass: string; onComplete: () => void }) {
  const { t } = useI18n();
  const [secondsLeft, setSecondsLeft] = useState(WORKOUT_TIMER_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  function reset() {
    setRunning(false);
    setSecondsLeft(WORKOUT_TIMER_SECONDS);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3 py-2.5">
      <span className={`num text-lg font-semibold ${accentClass}`}>{formatTime(secondsLeft)}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={secondsLeft === 0}
          className="p-2 rounded-md border border-border text-ink hover:border-current active:scale-90 transition disabled:opacity-40"
          title={running ? t("pause") : t("start")}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={reset}
          className="p-2 rounded-md border border-border text-muted hover:text-ink active:scale-90 transition"
          title={t("resetTimer")}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
