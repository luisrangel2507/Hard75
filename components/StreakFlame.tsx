"use client";

import { Flame } from "lucide-react";
import { useCountUp } from "@/lib/useCountUp";

export function StreakFlame({ streak, label }: { streak: number; label: string }) {
  const animated = useCountUp(streak);
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
          streak > 0 ? "bg-gradient-to-br from-ember to-brass text-white shadow-[0_3px_10px_rgba(255,61,127,0.3)]" : "bg-border/40 text-muted"
        }`}
      >
        <Flame className="h-4.5 w-4.5" />
      </span>
      <div className="flex flex-col leading-none">
        <span className="num text-2xl font-semibold text-ink">{animated}</span>
        <span className="label-caps">{label}</span>
      </div>
    </div>
  );
}
