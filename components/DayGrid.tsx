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
          "aspect-square rounded-lg flex items-center justify-center text-[11px] num border transition active:scale-90";

        if (locked) {
          return (
            <div
              key={n}
              className={`${base} border-border/60 bg-card/50 text-muted/40 cursor-not-allowed`}
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
                ? "border-transparent bg-gradient-to-br from-brass to-ember text-white font-semibold shadow-[0_3px_8px_rgba(255,107,69,0.35)]"
                : isCurrent
                  ? "border-2 border-brass text-ink bg-card font-semibold"
                  : "border-border text-muted hover:text-ink hover:border-ink/40 bg-card"
            }`}
          >
            {n}
          </Link>
        );
      })}
    </div>
  );
}
