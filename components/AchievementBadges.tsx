import { Award } from "lucide-react";
import { ACHIEVEMENT_DAYS } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Lang } from "@/lib/types";

export function AchievementBadges({ streak, lang }: { streak: number; lang: Lang }) {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {ACHIEVEMENT_DAYS.map((d) => {
        const unlocked = streak >= d;
        return (
          <div
            key={d}
            className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 ${
              unlocked ? "border-brass bg-brass/10" : "border-border bg-card opacity-50"
            }`}
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                unlocked ? "bg-brass/20 border border-brass" : "bg-border/40 border border-border"
              }`}
            >
              <Award className={`h-4.5 w-4.5 ${unlocked ? "text-brass" : "text-muted"}`} />
            </div>
            <span className={`num text-sm font-bold ${unlocked ? "text-ink" : "text-muted"}`}>{d}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted">{t(lang, "days")}</span>
          </div>
        );
      })}
    </div>
  );
}
