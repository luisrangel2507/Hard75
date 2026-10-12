"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MountainScene } from "@/components/MountainScene";
import { TOTAL_DAYS } from "@/lib/types";

export function TodayHero({
  image,
  dayNumber,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  status,
  tagline,
}: {
  image?: string | null;
  dayNumber: number;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  status: string;
  tagline: string;
}) {
  return (
    <section className="relative overflow-hidden -mx-4 -mt-6 min-h-[300px] border-b border-border">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <MountainScene variant="hero" className="absolute inset-0 h-full w-full" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/30" />

      <div className="absolute left-4 top-16 flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className="font-game text-7xl italic text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">75</span>
          <svg viewBox="0 0 24 24" className="h-12 w-12 -ml-1" aria-hidden>
            <defs>
              <linearGradient id="today-sun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFC24D" />
                <stop offset="1" stopColor="#FF5A1F" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#today-sun)" />
            <path d="M3 14h18M4.5 17.5h15M7 21h10" stroke="#0A1020" strokeWidth="1.4" />
          </svg>
        </div>
        <span className="font-game text-xl text-white tracking-[0.55em] mt-1 drop-shadow">HARD</span>
      </div>

      <div className="absolute right-4 bottom-4 flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={prevDisabled}
            onClick={onPrev}
            aria-label="Previous day"
            className="h-8 w-8 rounded-full bg-black/35 backdrop-blur border border-white/15 flex items-center justify-center text-white disabled:opacity-30 active:scale-90 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-game text-3xl text-white">
            DAY <span className="text-brass">{dayNumber}</span> / {TOTAL_DAYS}
          </span>
          <button
            type="button"
            disabled={nextDisabled}
            onClick={onNext}
            aria-label="Next day"
            className="h-8 w-8 rounded-full bg-black/35 backdrop-blur border border-white/15 flex items-center justify-center text-white disabled:opacity-30 active:scale-90 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <span className="text-[11px] tracking-[0.35em] text-white/80 uppercase">{tagline}</span>
        <span className="text-[11px] text-white/70 h-3">{status}</span>
      </div>
    </section>
  );
}
