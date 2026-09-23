"use client";

import { useState } from "react";
import { LucideIcon, Timer as TimerIcon } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { DictKey } from "@/lib/i18n";

export type Accent = "ember" | "olive" | "steel" | "brass";

const ACCENT_STYLES: Record<Accent, { border: string; text: string; bg: string; solidBg: string }> = {
  ember: { border: "border-ember", text: "text-ember", bg: "bg-ember/10", solidBg: "bg-ember" },
  olive: { border: "border-olive", text: "text-olive", bg: "bg-olive/10", solidBg: "bg-olive" },
  steel: { border: "border-steel", text: "text-steel", bg: "bg-steel/10", solidBg: "bg-steel" },
  brass: { border: "border-brass", text: "text-brass", bg: "bg-brass/10", solidBg: "bg-brass" },
};

export function WorkoutCard({
  icon: Icon,
  label,
  checked,
  accent,
  types,
  typeValue,
  customValue,
  onToggle,
  onTypeChange,
  onCustomChange,
  onTimerComplete,
}: {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  accent: Accent;
  types: readonly string[];
  typeValue: string | null;
  customValue: string | null;
  onToggle: (next: boolean) => void;
  onTypeChange: (type: string) => void;
  onCustomChange: (text: string) => void;
  onTimerComplete: () => void;
}) {
  const { t } = useI18n();
  const styles = ACCENT_STYLES[accent];
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div
      className={`w-full rounded-lg border px-4 py-3.5 transition flex flex-col gap-3 ${
        checked ? `${styles.border} ${styles.bg}` : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onToggle(!checked)} className="flex items-center gap-3 active:scale-[0.97] transition-transform">
          <Icon className={`h-4 w-4 ${checked ? styles.text : "text-muted"}`} />
          <span className={`label-caps ${checked ? "text-ink" : ""}`}>{label}</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTimer((s) => !s)}
            className={`p-1.5 rounded-md border transition active:scale-90 ${
              showTimer ? `${styles.border} ${styles.text}` : "border-border text-muted hover:text-ink"
            }`}
            title={t("workoutTimer")}
          >
            <TimerIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggle(!checked)}
            className={`h-5 w-9 rounded-full relative transition-colors active:scale-95 ${
              checked ? styles.solidBg : "bg-border"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
                checked ? "translate-x-4" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wide font-semibold border transition active:scale-95 ${
              typeValue === type
                ? `${styles.border} ${styles.bg} ${styles.text}`
                : "border-border text-muted hover:text-ink"
            }`}
          >
            {t(`ex_${type}` as DictKey)}
          </button>
        ))}
      </div>

      {typeValue === "other" && (
        <input
          type="text"
          value={customValue ?? ""}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder={t("customTypePlaceholder")}
          className="bg-bg border border-border rounded-md px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-brass"
        />
      )}

      {showTimer && <WorkoutTimer accentClass={styles.text} onComplete={onTimerComplete} />}
    </div>
  );
}
