"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChallengeDay } from "@/lib/types";

export function WeightChart({ days }: { days: ChallengeDay[] }) {
  const data = days
    .filter((d) => d.weight_kg != null)
    .map((d) => ({ day: d.day_number, weight: Number(d.weight_kg) }));

  if (data.length < 2) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-muted">
        —
      </div>
    );
  }

  return (
    <div className="h-56 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#332F26" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#8C8879"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#332F26" }}
          />
          <YAxis
            stroke="#8C8879"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 1", "dataMax + 1"]}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: "#1D1B16",
              border: "1px solid #332F26",
              borderRadius: 8,
              color: "#EDEAE1",
              fontSize: 12,
            }}
            labelFormatter={(label) => `Día ${label}`}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#B8923A"
            strokeWidth={2}
            dot={{ r: 2, fill: "#B8923A" }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
