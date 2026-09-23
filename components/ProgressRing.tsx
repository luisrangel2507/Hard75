"use client";

import { useCountUp } from "@/lib/useCountUp";

export function ProgressRing({ value, max, label }: { value: number; max: number; label: string }) {
  const animated = useCountUp(value);
  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, value / max);
  const offset = circumference * (1 - pct);

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="stroke-border" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-brass transition-[stroke-dashoffset] duration-700 ease-out"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-2xl font-bold text-ink leading-none">{animated}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted mt-0.5">{label}</span>
      </div>
    </div>
  );
}
