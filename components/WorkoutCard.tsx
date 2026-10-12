"use client";

import { useState } from "react";
import { LucideIcon, Timer as TimerIcon } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { Switch, TONES, TaskCard, TaskTone } from "@/components/TaskCard";
import { DictKey } from "@/lib/i18n";

export function WorkoutCard({
  icon,
  label,
  subtitle,
  checked,
  tone,
  image,
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
  subtitle: string;
  checked: boolean;
  tone: TaskTone;
  image?: string | null;
  types: readonly string[];
  typeValue: string | null;
  customValue: string | null;
  onToggle: (next: boolean) => void;
  onTypeChange: (type: string) => void;
  onCustomChange: (text: string) => void;
  onTimerComplete: () => void;
}) {
  const { t } = useI18n();
  const tn = TONES[tone];
  const [showTimer, setShowTimer] = useState(false);

  return (
    <TaskCard
      icon={icon}
      tone={tone}
      title={label}
      subtitle={subtitle}
      image={image}
      onHeaderClick={() => onToggle(!checked)}
      right={
        <>
          <button
            type="button"
            onClick={() => setShowTimer((s) => !s)}
            className={`h-10 w-10 rounded-full flex items-center justify-center border transition active:scale-90 ${
              showTimer ? `border-white/40 ${tn.iconText} bg-white/10` : "border-white/15 bg-black/30 text-white/80"
            }`}
            title={t("workoutTimer")}
          >
            <TimerIcon className="h-4 w-4" />
          </button>
          <Switch checked={checked} onChange={onToggle} label={label} />
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium border transition active:scale-95 ${
              typeValue === type ? tn.chipOn : "border-white/15 bg-black/30 text-ink/90 hover:text-white"
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
          className="bg-bg/80 border border-border rounded-xl px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-brass"
        />
      )}

      {showTimer && <WorkoutTimer accentClass={tn.iconText} onComplete={onTimerComplete} />}
    </TaskCard>
  );
}
