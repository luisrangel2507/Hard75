"use client";

import { Droplets, Minus, Plus } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WATER_GOAL_ML } from "@/lib/types";

const BUBBLES = [
  { left: "18%", delay: "0s", duration: "3.1s", size: 5 },
  { left: "38%", delay: "0.9s", duration: "2.5s", size: 4 },
  { left: "58%", delay: "1.7s", duration: "3.6s", size: 6 },
  { left: "78%", delay: "0.4s", duration: "2.8s", size: 4 },
];

export function WaterTracker({
  waterMl,
  onChange,
  disabled,
}: {
  waterMl: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const pct = Math.min(100, Math.round((waterMl / WATER_GOAL_ML) * 100));
  const fillPct = Math.max(pct, 6);
  const met = waterMl >= WATER_GOAL_ML;

  function bump(delta: number) {
    onChange(Math.max(0, waterMl + delta));
  }

  return (
    <div className={`card-base p-4 flex flex-col gap-3 border ${met ? "border-steel" : "border-border"}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 label-caps">
          <Droplets className={`h-4 w-4 ${met ? "text-steel" : "text-muted"}`} />
          {t("water")}
        </span>
        <span className="num text-sm text-ink">
          {(waterMl / 1000).toFixed(1)}
          {t("l")} / {(WATER_GOAL_ML / 1000).toFixed(1)}
          {t("l")}
        </span>
      </div>

      <div className="relative h-28 w-full rounded-xl overflow-hidden border border-border bg-bg">
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden bg-gradient-to-b from-steel/85 to-steel transition-[height] duration-500 ease-out"
          style={{ height: `${fillPct}%` }}
        >
          <svg
            className="absolute -top-2.5 left-0 h-4 w-[200%] animate-wave-slow"
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 Q 25 2 50 10 T 100 10 T 150 10 T 200 10 V20 H0 Z"
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
          <svg
            className="absolute -top-1.5 left-0 h-4 w-[200%] animate-wave-fast"
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 Q 25 17 50 10 T 100 10 T 150 10 T 200 10 V20 H0 Z"
              fill="rgba(255,255,255,0.45)"
            />
          </svg>

          {BUBBLES.map((b, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/60 animate-bubble"
              style={{
                left: b.left,
                bottom: 2,
                width: b.size,
                height: b.size,
                animationDelay: b.delay,
                animationDuration: b.duration,
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className={`num text-2xl font-bold ${pct > 45 ? "text-white drop-shadow" : "text-ink"}`}>
            {pct}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => bump(-250)}
          className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-border py-2 text-xs uppercase tracking-wide font-semibold text-muted hover:text-ink hover:border-steel/50 active:scale-95 transition disabled:opacity-50"
        >
          <Minus className="h-3.5 w-3.5" /> 250
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => bump(250)}
          className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-steel/40 bg-steel/10 py-2 text-xs uppercase tracking-wide font-semibold text-steel hover:brightness-110 active:scale-95 transition disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> 250
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => bump(500)}
          className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-steel/40 bg-steel/10 py-2 text-xs uppercase tracking-wide font-semibold text-steel hover:brightness-110 active:scale-95 transition disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> 500
        </button>
      </div>
    </div>
  );
}
