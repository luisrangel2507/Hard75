"use client";

import Link from "next/link";
import { Lock, Swords } from "lucide-react";
import { ChallengeDay } from "@/lib/types";
import { isDayComplete, isDayLocked } from "@/lib/challenge";
import { BOSS_DAYS } from "@/lib/game";
import { PHASES } from "@/lib/phases";
import { useI18n } from "@/components/I18nProvider";

export function DayGrid({
  daysByNumber,
  streak,
  currentDay,
}: {
  daysByNumber: Map<number, ChallengeDay>;
  streak: number;
  currentDay: number;
}) {
  const { lang } = useI18n();
  const es = lang === "es";

  return (
    <div className="flex flex-col gap-4">
      {PHASES.map((phase) => {
        const days = Array.from({ length: phase.end - phase.start + 1 }, (_, i) => phase.start + i);
        const done = days.filter((n) => isDayComplete(daysByNumber.get(n))).length;
        return (
          <div key={phase.id} className="card-base p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-game text-[13px] text-white">
                {es ? "MUNDO" : "WORLD"} {phase.id} · {phase.name[lang].toUpperCase()}
              </span>
              <span className="num text-[11px] text-muted">
                {done}/{days.length}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {days.map((n) => {
                const complete = isDayComplete(daysByNumber.get(n));
                const locked = isDayLocked(n, streak);
                const isCurrent = n === currentDay;
                const isBoss = (BOSS_DAYS as readonly number[]).includes(n);
                const base = `aspect-square rounded-xl flex items-center justify-center text-xs num border-b-4 transition active:scale-90 ${
                  isBoss ? "ring-2 ring-white/70 ring-offset-2 ring-offset-card" : ""
                }`;

                if (locked) {
                  return (
                    <div key={n} className={`${base} border-[#0B1426] bg-[#0E1830] text-muted/50 cursor-not-allowed`}>
                      {isBoss ? <Swords className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                    </div>
                  );
                }
                return (
                  <Link
                    key={n}
                    href={`/day/${n}`}
                    className={`${base} ${
                      complete
                        ? "border-[#B63A0E] bg-brass text-white font-bold"
                        : isCurrent
                          ? "border-[#B63A0E] bg-brass/20 text-brass font-bold ring-2 ring-brass animate-level-bounce"
                          : "border-[#16233A] bg-border text-ink"
                    }`}
                  >
                    {isBoss ? <Swords className="h-4 w-4" /> : n}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
