"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Scale } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WeightTrend } from "@/lib/challenge";
import { useUnits } from "@/lib/useUnits";
import { kgToLbs, lbsToKg, round1 } from "@/lib/units";

export function WeightInput({
  weightKg,
  onChange,
  trend,
  delta,
  previousDay,
}: {
  weightKg: number | null;
  onChange: (value: number | null) => void;
  trend: WeightTrend;
  delta: number | null;
  previousDay: number | null;
}) {
  const { t } = useI18n();
  const { units } = useUnits();
  const [lbsInput, setLbsInput] = useState(() => (weightKg != null ? String(round1(kgToLbs(weightKg))) : ""));

  const trendIcon =
    trend === "up" ? (
      <TrendingUp className="h-3.5 w-3.5 text-ember" />
    ) : trend === "down" ? (
      <TrendingDown className="h-3.5 w-3.5 text-olive" />
    ) : trend === "flat" ? (
      <Minus className="h-3.5 w-3.5 text-muted" />
    ) : null;

  const unitLabel = units === "imperial" ? t("lbs") : t("kg");
  const displayDelta = delta != null ? (units === "imperial" ? round1(kgToLbs(Math.abs(delta))) : Math.abs(delta)) : null;

  const trendLabel =
    trend === "up"
      ? `${t("trendUp")} ${displayDelta}${unitLabel}`
      : trend === "down"
        ? `${t("trendDown")} ${displayDelta}${unitLabel}`
        : trend === "flat"
          ? t("trendFlat")
          : t("trendNone");

  function handleLbsChange(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "");
    setLbsInput(cleaned);
    if (!cleaned) {
      onChange(null);
      return;
    }
    onChange(round1(lbsToKg(Number(cleaned))));
  }

  return (
    <div className="card-base border-olive/40 p-4 flex flex-col gap-2.5">
      <span className="flex items-center gap-2 label-caps">
        <span className="h-7 w-7 rounded-full bg-olive/15 text-olive flex items-center justify-center">
          <Scale className="h-3.5 w-3.5" />
        </span>
        {t("weight")}
      </span>
      <div className="flex items-center gap-2">
        {units === "imperial" ? (
          <input
            inputMode="decimal"
            value={lbsInput}
            onChange={(e) => handleLbsChange(e.target.value)}
            placeholder="—"
            className="num w-24 bg-bg border border-border rounded-xl px-3 py-2 text-ink text-lg focus:outline-none focus:border-olive"
          />
        ) : (
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={weightKg ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              onChange(raw === "" ? null : Number(raw));
            }}
            placeholder="—"
            className="num w-24 bg-bg border border-border rounded-xl px-3 py-2 text-ink text-lg focus:outline-none focus:border-olive"
          />
        )}
        <span className="label-caps">{unitLabel}</span>
      </div>
      {trend !== "none" && (
        <div className="flex items-center gap-1.5 text-xs text-muted">
          {trendIcon}
          <span>{trendLabel}</span>
          {previousDay && (
            <span>
              ({t("vs")} {previousDay})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
