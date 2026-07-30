"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        setError(true);
        return;
      }
      router.push(searchParams.get("next") || "/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <form
        onSubmit={handleSubmit}
        className="card-base w-full max-w-sm p-6 flex flex-col gap-5 animate-fade-in"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-12 w-12 rounded-full bg-brass/15 border border-brass/40 flex items-center justify-center">
            <Lock className="h-5 w-5 text-brass" />
          </div>
          <h1 className="text-xl font-semibold tracking-wide text-ink">FIT FOR 75</h1>
        </div>
        <div className="flex flex-col gap-2">
          <label className="label-caps" htmlFor="passcode">
            {t("passcode")}
          </label>
          <input
            id="passcode"
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder={t("passcodePlaceholder")}
            className="bg-bg border border-border rounded-md px-3 py-2 text-ink placeholder:text-muted focus:outline-none focus:border-brass"
          />
          {error && <p className="text-sm text-ember">{t("invalidPasscode")}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-brass text-bg font-semibold uppercase tracking-wide text-sm rounded-md py-2.5 hover:brightness-110 transition disabled:opacity-60"
        >
          {t("login")}
        </button>
      </form>
    </main>
  );
}
