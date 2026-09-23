"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
          <Image
            src="/logo.png"
            alt="75 Rise"
            width={125}
            height={83}
            className="h-[83px] w-auto drop-shadow-[0_6px_14px_rgba(255,107,69,0.35)]"
            priority
          />
          <h1 className="text-xl font-semibold tracking-wide text-ink">
            75 <span className="text-brass">RISE</span>
          </h1>
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
            className="bg-bg border border-border rounded-xl px-3 py-2.5 text-ink placeholder:text-muted focus:outline-none focus:border-brass"
          />
          {error && <p className="text-sm text-ember">{t("invalidPasscode")}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-brass to-ember text-white font-semibold uppercase tracking-wide text-sm rounded-xl py-3 shadow-[0_6px_16px_rgba(255,107,69,0.35)] hover:brightness-105 active:scale-[0.97] transition disabled:opacity-60"
        >
          {t("login")}
        </button>
      </form>
    </main>
  );
}
