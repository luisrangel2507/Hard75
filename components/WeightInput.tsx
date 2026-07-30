"use client";

import { TrendingUp, TrendingDown, Minus, Scale } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WeightTrend } from "@/lib/challenge";

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

  const trendIcon =
    trend === "up" ? (
      <TrendingUp className="h-3.5 w-3.5 text-ember" />
    ) : trend === "down" ? (
      <TrendingDown className="h-3.5 w-3.5 text-olive" />
    ) : trend === "flat" ? (
      <Minus className="h-3.5 w-3.5 text-muted" />
    ) : null;

  const trendLabel =
    trend === "up"
      ? `${t("trendUp")} ${delta}${t("kg")}`
      : trend === "down"
        ? `${t("trendDown")} ${Math.abs(delta ?? 0)}${t("kg")}`
        : trend === "flat"
          ? t("trendFlat")
          : t("trendNone");

  return (
    <div className="card-base border-olive/40 p-4 flex flex-col gap-2.5">
      <span className="flex items-center gap-2 label-caps">
        <Scale className="h-4 w-4 text-olive" />
        {t("weight")}
      </span>
      <div className="flex items-center gap-2">
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
          className="num w-24 bg-bg border border-border rounded-md px-3 py-2 text-ink text-lg focus:outline-none focus:border-olive"
        />
        <span className="label-caps">{t("kg")}</span>
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
