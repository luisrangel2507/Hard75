"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

export function ResetButton() {
  const { lang } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const es = lang === "es";

  async function reset() {
    const ok = window.confirm(
      es
        ? "¿Reiniciar el reto? Se borran todos los días, libros, citas y fotos. No se puede deshacer."
        : "Restart the challenge? All days, books, quotes and photos will be deleted. This can't be undone."
    );
    if (!ok) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (!res.ok) throw new Error("reset failed");
      try {
        localStorage.removeItem("ff75_onboarded");
      } catch {
        /* ignore */
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={reset}
        disabled={busy}
        className="flex items-center justify-center gap-2 rounded-2xl border border-ember/40 bg-ember/10 py-3 text-sm font-semibold text-ember active:scale-[0.98] transition disabled:opacity-50"
      >
        <RotateCcw className="h-4 w-4" />
        {busy ? (es ? "Reiniciando…" : "Restarting…") : es ? "Reiniciar reto" : "Restart challenge"}
      </button>
      {error && <p className="text-xs text-ember text-center">{es ? "No se pudo reiniciar." : "Couldn't restart."}</p>}
    </div>
  );
}
