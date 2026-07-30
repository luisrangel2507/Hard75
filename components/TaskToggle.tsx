"use client";

import { LucideIcon } from "lucide-react";

export type Accent = "ember" | "olive" | "steel" | "brass";

const ACCENT_STYLES: Record<Accent, { border: string; text: string; bg: string; solidBg: string }> = {
  ember: { border: "border-ember", text: "text-ember", bg: "bg-ember/10", solidBg: "bg-ember" },
  olive: { border: "border-olive", text: "text-olive", bg: "bg-olive/10", solidBg: "bg-olive" },
  steel: { border: "border-steel", text: "text-steel", bg: "bg-steel/10", solidBg: "bg-steel" },
  brass: { border: "border-brass", text: "text-brass", bg: "bg-brass/10", solidBg: "bg-brass" },
};

export function TaskToggle({
  icon: Icon,
  label,
  checked,
  accent,
  onChange,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  accent: Accent;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  const styles = ACCENT_STYLES[accent];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between gap-3 rounded-lg border px-4 py-3.5 transition disabled:opacity-50 ${
        checked ? `${styles.border} ${styles.bg}` : "border-border bg-card"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${checked ? styles.text : "text-muted"}`} />
        <span className={`label-caps ${checked ? "text-ink" : ""}`}>{label}</span>
      </span>
      <span
        className={`h-5 w-9 rounded-full relative transition-colors ${
          checked ? styles.solidBg : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
