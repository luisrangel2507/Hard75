"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { ChallengeDay, TOTAL_DAYS } from "@/lib/types";
import { isDayComplete, isDayLocked } from "@/lib/challenge";

export function DayGrid({
  daysByNumber,
  streak,
  currentDay,
}: {
  daysByNumber: Map<number, ChallengeDay>;
  streak: number;
  currentDay: number;
}) {
  return (
    <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
      {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((n) => {
        const day = daysByNumber.get(n);
        const complete = isDayComplete(day);
        const locked = isDayLocked(n, streak);
        const isCurrent = n === currentDay;

        const base =
          "aspect-square rounded-md flex items-center justify-center text-[11px] num border transition";

        if (locked) {
          return (
            <div
              key={n}
              className={`${base} border-border bg-card/50 text-muted/40 cursor-not-allowed`}
              title={n.toString()}
            >
              <Lock className="h-3 w-3" />
            </div>
          );
        }

        return (
          <Link
            key={n}
            href={`/day/${n}`}
            className={`${base} ${
              complete
                ? "border-brass bg-brass/20 text-brass font-semibold"
                : isCurrent
                  ? "border-ink text-ink"
                  : "border-border text-muted hover:text-ink hover:border-ink/40"
            }`}
          >
            {n}
          </Link>
        );
      })}
    </div>
  );
}
