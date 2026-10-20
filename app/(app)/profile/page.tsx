import { query } from "@/lib/db";
import { t } from "@/lib/i18n";
import { resolveLang } from "@/lib/langServer";
import { ChallengeDay } from "@/lib/types";
import { buildDaysMap, computeStreak, maxNavigableDay } from "@/lib/challenge";
import { totalXp } from "@/lib/game";
import { PlayerCard } from "@/components/PlayerCard";
import { ResetButton } from "@/components/ResetButton";
import { LogoutButton } from "@/components/LogoutButton";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const lang = resolveLang();
  const rows = await query<ChallengeDay>("SELECT * FROM challenge_days ORDER BY day_number ASC");
  const streak = computeStreak(buildDaysMap(rows));

  return (
    <>
      <PlayerCard xp={totalXp(rows)} day={maxNavigableDay(streak)} streak={streak} lang={lang} />
      <p className="section-title">{t(lang, "profile")}</p>
      <ProfileForm />
      <ResetButton />
      <LogoutButton />
    </>
  );
}
