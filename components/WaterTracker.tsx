"use client";

import { Droplets, Minus, Plus } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WATER_GOAL_ML } from "@/lib/types";

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

      <div className="h-2.5 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-steel transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => bump(-250)}
          className="flex-1 flex items-center justify-center gap-1 rounded-md border border-border py-2 text-xs uppercase tracking-wide font-semibold text-muted hover:text-ink hover:border-steel/50 active:scale-95 transition disabled:opacity-50"
        >
          <Minus className="h-3.5 w-3.5" /> 250
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => bump(250)}
          className="flex-1 flex items-center justify-center gap-1 rounded-md border border-steel/40 bg-steel/10 py-2 text-xs uppercase tracking-wide font-semibold text-steel hover:brightness-110 active:scale-95 transition disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> 250
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => bump(500)}
          className="flex-1 flex items-center justify-center gap-1 rounded-md border border-steel/40 bg-steel/10 py-2 text-xs uppercase tracking-wide font-semibold text-steel hover:brightness-110 active:scale-95 transition disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> 500
        </button>
      </div>
    </div>
  );
}
