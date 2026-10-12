"use client";

import { Droplets, Plus } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { TaskCard } from "@/components/TaskCard";
import { WATER_GOAL_ML } from "@/lib/types";

const CUPS = 9;
const CUP_ML = Math.round(WATER_GOAL_ML / CUPS);

function Cup({ fill }: { fill: number }) {
  return (
    <svg viewBox="0 0 28 34" className="h-9 w-7" aria-hidden>
      <defs>
        <clipPath id="cup-clip">
          <path d="M3 2h22l-3 28a3 3 0 0 1-3 2.5H9A3 3 0 0 1 6 30L3 2z" />
        </clipPath>
      </defs>
      <path d="M3 2h22l-3 28a3 3 0 0 1-3 2.5H9A3 3 0 0 1 6 30L3 2z" fill="rgba(255,255,255,0.08)" />
      <rect x="0" y={34 - 34 * fill} width="28" height={34 * fill} fill="#2F8CFF" clipPath="url(#cup-clip)" />
      <path d="M3 2h22l-3 28a3 3 0 0 1-3 2.5H9A3 3 0 0 1 6 30L3 2z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    </svg>
  );
}

export function WaterTracker({
  waterMl,
  onChange,
  disabled,
  image,
}: {
  waterMl: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  image?: string | null;
}) {
  const { t, lang } = useI18n();
  const pct = Math.min(100, Math.round((waterMl / WATER_GOAL_ML) * 100));

  function tapCup(i: number) {
    const full = (i + 1) * CUP_ML;
    const isLastFull = waterMl >= full - 1 && waterMl < full + CUP_ML - 1;
    onChange(isLastFull ? i * CUP_ML : full);
  }

  return (
    <TaskCard
      icon={Droplets}
      tone="blue"
      title={t("water")}
      subtitle={lang === "es" ? "3.8 L (1 galón)" : "3.8 L (1 gallon)"}
      image={image}
      right={
        <span className="num text-lg font-medium text-ink">
          {(waterMl / 1000).toFixed(1)}
          {t("l")} / {(WATER_GOAL_ML / 1000).toFixed(1)}
          {t("l")}
        </span>
      }
    >
      <div className="relative h-8 w-[88%] rounded-full bg-white/10 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1E6FE0] to-steel transition-[width] duration-500"
          style={{ width: `${Math.max(pct, 12)}%` }}
        />
        <span className="absolute inset-y-0 flex items-center num text-sm font-semibold text-white" style={{ left: `clamp(0.6rem, calc(${Math.max(pct, 12)}% - 3rem), 100%)` }}>
          {pct}%
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: CUPS }, (_, i) => {
          const fill = Math.max(0, Math.min(1, (waterMl - i * CUP_ML) / CUP_ML));
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => tapCup(i)}
              aria-label={`${(i + 1) * CUP_ML} ml`}
              className="active:scale-90 transition disabled:opacity-50"
            >
              <Cup fill={fill} />
            </button>
          );
        })}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(waterMl + 250)}
          aria-label="+250 ml"
          className="h-10 w-10 rounded-full border border-white/25 bg-black/30 flex items-center justify-center text-white active:scale-90 transition disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </TaskCard>
  );
}
