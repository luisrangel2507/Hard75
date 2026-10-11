"use client";

import { useEffect, useRef, useState } from "react";
import { Swords, Zap } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { completedTaskCount, isDayComplete } from "@/lib/challenge";
import { BOSSES, BOSS_DAYS, TASKS_PER_DAY, XP_PER_TASK, dayXp } from "@/lib/game";
import { ChallengeDay } from "@/lib/types";

export function QuestBar({ day }: { day: ChallengeDay }) {
  const { lang } = useI18n();
  const es = lang === "es";
  const done = completedTaskCount(day);
  const complete = isDayComplete(day);
  const isBoss = (BOSS_DAYS as readonly number[]).includes(day.day_number);

  const prev = useRef(done);
  const [pops, setPops] = useState<number[]>([]);

  useEffect(() => {
    const gained = done - prev.current;
    prev.current = done;
    if (gained <= 0) return;
    const id = Date.now();
    setPops((p) => [...p, id]);
    const timer = setTimeout(() => setPops((p) => p.filter((x) => x !== id)), 1400);
    return () => clearTimeout(timer);
  }, [done]);

  return (
    <section
      className={`card-base p-4 flex flex-col gap-3 relative ${complete ? "border-olive" : ""}`}
      aria-label={es ? "Misión del día" : "Daily quest"}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col leading-tight">
          <span className="label-caps">{es ? "Misión del día" : "Daily quest"}</span>
          <span className="text-base font-bold text-ink">
            {complete ? (es ? "¡Misión cumplida!" : "Quest complete!") : `${done}/${TASKS_PER_DAY} ${es ? "objetivos" : "objectives"}`}
          </span>
        </div>
        <div className="relative">
          <span className="flex items-center gap-1 num text-sm font-bold text-brass">
            <Zap className="h-3.5 w-3.5" />
            {dayXp(day)} XP
          </span>
          {pops.map((id) => (
            <span
              key={id}
              className="absolute right-0 -top-1 num text-sm font-bold text-olive animate-xp-pop pointer-events-none whitespace-nowrap"
            >
              +{XP_PER_TASK} XP
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: TASKS_PER_DAY }, (_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              i < done ? (complete ? "bg-olive" : "bg-brass") : "bg-border"
            }`}
          />
        ))}
      </div>

      {isBoss && (
        <div className="flex items-center gap-3 rounded-xl bg-ink text-white px-3 py-2.5">
          <Swords className="h-5 w-5 shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-white/70">{es ? "Día de jefe" : "Boss day"} · +200 XP</span>
            <span className="text-sm font-semibold">{BOSSES[day.day_number][lang]}</span>
          </div>
        </div>
      )}
    </section>
  );
}
