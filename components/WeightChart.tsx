"use client";

import { Scale } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/components/I18nProvider";
import { useUnits } from "@/lib/useUnits";
import { kgToLbs, round1 } from "@/lib/units";
import { ChallengeDay } from "@/lib/types";

export function WeightChart({ days }: { days: ChallengeDay[] }) {
  const { t } = useI18n();
  const { units } = useUnits();
  const data = days
    .filter((d) => d.weight_kg != null)
    .map((d) => ({
      day: d.day_number,
      weight: units === "imperial" ? round1(kgToLbs(Number(d.weight_kg))) : Number(d.weight_kg),
    }));

  if (data.length < 2) {
    return (
      <div className="h-56 flex flex-col items-center justify-center gap-2 text-center">
        <div className="h-12 w-12 rounded-full bg-border/40 flex items-center justify-center">
          <Scale className="h-5 w-5 text-muted" />
        </div>
        <p className="text-sm text-muted">{t("noWeightYet")}</p>
      </div>
    );
  }

  return (
    <div className="h-56 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#1F2C45" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#8B98B0"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#1F2C45" }}
          />
          <YAxis
            stroke="#8B98B0"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 1", "dataMax + 1"]}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: "#101A2E",
              border: "1px solid #1F2C45",
              borderRadius: 8,
              color: "#F2F5FA",
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value} ${units === "imperial" ? t("lbs") : t("kg")}`, t("weight")]}
            labelFormatter={(label) => `${t("day")} ${label}`}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#FF5A1F"
            strokeWidth={2}
            dot={{ r: 2, fill: "#FF5A1F" }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
