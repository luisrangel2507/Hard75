"use client";

import { Flame } from "lucide-react";
import { useCountUp } from "@/lib/useCountUp";

export function StreakFlame({ streak, label }: { streak: number; label: string }) {
  const animated = useCountUp(streak);
  return (
    <div className="flex items-center gap-2">
      <Flame className={`h-5 w-5 ${streak > 0 ? "text-ember" : "text-muted"}`} />
      <div className="flex items-baseline gap-1.5">
        <span className="num text-2xl font-semibold text-ink">{animated}</span>
        <span className="label-caps">{label}</span>
      </div>
    </div>
  );
}
