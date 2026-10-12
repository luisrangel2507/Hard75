import { Image as ImageIcon } from "lucide-react";
import { query } from "@/lib/db";
import { t } from "@/lib/i18n";
import { resolveLang } from "@/lib/langServer";
import { ChallengeDay } from "@/lib/types";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";
import { WeightChart } from "@/components/WeightChart";
import { BackupPanel } from "@/components/BackupPanel";
import { AchievementBadges } from "@/components/AchievementBadges";
import { BookShelf } from "@/components/BookShelf";
import { ShareProgress } from "@/components/ShareProgress";
import { DayGrid } from "@/components/DayGrid";
import { levelFromXp, totalXp, titleForLevel } from "@/lib/game";
import { isDayComplete } from "@/lib/challenge";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const lang = resolveLang();
  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  const daysMap = buildDaysMap(rows);
  const streak = computeStreak(daysMap);
  const currentDayNumber = maxNavigableDay(streak);

  const withProgressPhoto = rows.filter((d) => d.progress_photo_url);
  const first = withProgressPhoto[0];
  const last = withProgressPhoto[withProgressPhoto.length - 1];

  const xp = totalXp(rows);
  const level = levelFromXp(xp);
  const es = lang === "es";
  const stats = [
    { label: es ? "NIVEL" : "LEVEL", value: String(level), sub: titleForLevel(level, lang) },
    { label: "XP", value: String(xp), sub: es ? "Total" : "Total" },
    { label: es ? "DÍAS" : "DAYS", value: `${rows.filter((d) => isDayComplete(d)).length}/75`, sub: es ? "Completos" : "Complete" },
  ];

  return (
    <>
      <section className="grid grid-cols-3 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="card-base p-3 flex flex-col items-center gap-1 text-center">
            <span className="font-game text-[11px] text-muted">{s.label}</span>
            <span className="font-game text-3xl text-brass leading-none">{s.value}</span>
            <span className="text-[10px] text-muted truncate max-w-full">{s.sub}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <p className="section-title">{t(lang, "allDays")}</p>
        <DayGrid daysByNumber={daysMap} streak={streak} currentDay={currentDayNumber} />
      </section>

      <section className="card-base p-4 flex flex-col gap-2">
        <span className="section-title">{t(lang, "weightChart")}</span>
        <WeightChart days={rows} />
      </section>

      <section className="flex flex-col gap-2">
        <span className="section-title">{t(lang, "achievements")}</span>
        <AchievementBadges streak={streak} lang={lang} />
      </section>

      {first && last && first.id !== last.id && (
        <section className="flex flex-col gap-2">
          <span className="section-title">{t(lang, "beforeAfter")}</span>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={first.progress_photo_url as string}
                  alt={t(lang, "before")}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <span className="text-xs text-muted text-center">
                {t(lang, "before")} · {t(lang, "day")} {first.day_number}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-brass">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={last.progress_photo_url as string}
                  alt={t(lang, "after")}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <span className="text-xs text-brass text-center">
                {t(lang, "after")} · {t(lang, "day")} {last.day_number}
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <span className="section-title">{t(lang, "gallery")}</span>
        {withProgressPhoto.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-border/40 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted" />
            </div>
            <p className="text-sm text-muted">{t(lang, "noPhotosYet")}</p>
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {withProgressPhoto.map((d) => (
              <div key={d.id} className="shrink-0 flex flex-col items-center gap-1">
                <div className="relative h-28 w-24 rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.progress_photo_url as string}
                    alt={`Day ${d.day_number}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <span className="num text-xs text-muted">{d.day_number}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <span className="section-title">{t(lang, "myLibrary")}</span>
        <BookShelf />
      </section>

      <ShareProgress
        dayNumber={currentDayNumber}
        streak={streak}
        photoUrl={last?.progress_photo_url ?? first?.progress_photo_url ?? null}
      />

      <BackupPanel />
    </>
  );
}
