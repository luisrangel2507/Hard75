"use client";

import Link from "next/link";
import { Lock, Swords } from "lucide-react";
import { ChallengeDay, TOTAL_DAYS } from "@/lib/types";
import { isDayComplete, isDayLocked } from "@/lib/challenge";
import { BOSS_DAYS } from "@/lib/game";

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
        const isBoss = (BOSS_DAYS as readonly number[]).includes(n);

        const base =
          `aspect-square ${isBoss ? "ring-2 ring-ink/80 ring-offset-1 ring-offset-bg" : ""} rounded-lg flex items-center justify-center text-[11px] num border transition active:scale-90`;

        if (locked) {
          return (
            <div
              key={n}
              className={`${base} border-border/60 bg-card/50 text-muted/40 cursor-not-allowed`}
              title={n.toString()}
            >
              {isBoss ? <Swords className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            </div>
          );
        }

        return (
          <Link
            key={n}
            href={`/day/${n}`}
            className={`${base} ${
              complete
                ? "border-transparent bg-brass text-white font-semibold"
                : isCurrent
                  ? "border-2 border-brass text-ink bg-card font-semibold"
                  : "border-border text-muted hover:text-ink hover:border-ink/40 bg-card"
            }`}
          >
            {isBoss ? <Swords className="h-3.5 w-3.5" /> : n}
          </Link>
        );
      })}
    </div>
  );
}
