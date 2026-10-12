"use client";

import type { LucideIcon } from "lucide-react";

export type TaskTone = "orange" | "green" | "purple" | "red" | "blue";

export const TONES: Record<TaskTone, { iconBg: string; iconText: string; chipOn: string }> = {
  orange: { iconBg: "bg-brass/15", iconText: "text-brass", chipOn: "bg-ember text-white border-transparent" },
  green: { iconBg: "bg-olive/15", iconText: "text-olive", chipOn: "bg-olive text-white border-transparent" },
  purple: { iconBg: "bg-[#8B7CF6]/20", iconText: "text-[#8B7CF6]", chipOn: "bg-[#8B7CF6] text-white border-transparent" },
  red: { iconBg: "bg-ember/15", iconText: "text-ember", chipOn: "bg-ember text-white border-transparent" },
  blue: { iconBg: "bg-steel/15", iconText: "text-steel", chipOn: "bg-steel text-white border-transparent" },
};

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`h-8 w-14 rounded-full relative transition-colors active:scale-95 shrink-0 ${checked ? "bg-brass" : "bg-white/15"}`}
    >
      <span
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : ""}`}
      />
    </button>
  );
}

export function TaskCard({
  icon: Icon,
  tone,
  title,
  subtitle,
  image,
  right,
  onHeaderClick,
  children,
}: {
  icon: LucideIcon;
  tone: TaskTone;
  title: string;
  subtitle?: string;
  image?: string | null;
  right?: React.ReactNode;
  onHeaderClick?: () => void;
  children?: React.ReactNode;
}) {
  const tn = TONES[tone];
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-y-0 right-0 h-full w-[62%] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 via-40% to-card/20" />
        </>
      )}
      <div className="relative p-4 flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onHeaderClick}
            disabled={!onHeaderClick}
            className="flex items-center gap-3 flex-1 min-w-0 text-left disabled:cursor-default"
          >
            <span className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${tn.iconBg} ${tn.iconText}`}>
              <Icon className="h-6 w-6" />
            </span>
            <span className="flex flex-col min-w-0">
              <span className="text-[17px] font-semibold text-ink leading-tight">{title}</span>
              {subtitle && <span className="text-sm text-muted leading-tight mt-0.5">{subtitle}</span>}
            </span>
          </button>
          {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}
