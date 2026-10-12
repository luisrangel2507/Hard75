"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

export function LogoutButton() {
  const { t } = useI18n();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-muted hover:text-ember active:scale-[0.98] transition"
    >
      <LogOut className="h-4 w-4" />
      {t("logout")}
    </button>
  );
}
