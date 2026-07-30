import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { t } from "@/lib/i18n";
import { ChallengeDay, Lang } from "@/lib/types";
import { WeightChart } from "@/components/WeightChart";
import { BackupPanel } from "@/components/BackupPanel";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const lang: Lang = cookies().get("ff75_lang")?.value === "en" ? "en" : "es";
  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");

  const withProgressPhoto = rows.filter((d) => d.progress_photo_url);
  const first = withProgressPhoto[0];
  const last = withProgressPhoto[withProgressPhoto.length - 1];

  return (
    <>
      <section className="card-base p-4 flex flex-col gap-2">
        <span className="label-caps">{t(lang, "weightChart")}</span>
        <WeightChart days={rows} />
      </section>

      {first && last && first.id !== last.id && (
        <section className="flex flex-col gap-2">
          <span className="label-caps">{t(lang, "beforeAfter")}</span>
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
        <span className="label-caps">{t(lang, "gallery")}</span>
        {withProgressPhoto.length === 0 ? (
          <p className="text-sm text-muted">{t(lang, "noPhotosYet")}</p>
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

      <BackupPanel />
    </>
  );
}
