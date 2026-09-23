import { t } from "@/lib/i18n";
import { resolveLang } from "@/lib/langServer";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const lang = resolveLang();

  return (
    <>
      <p className="label-caps">{t(lang, "profile")}</p>
      <ProfileForm />
    </>
  );
}
