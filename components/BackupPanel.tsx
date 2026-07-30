"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export function BackupPanel() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  function handleExport() {
    window.location.href = "/api/export";
  }

  async function handleImportFile(file: File) {
    if (!confirm(t("importWarning"))) return;
    setBusy(true);
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      // ignore malformed file
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card-base p-4 flex flex-col gap-3">
      <span className="label-caps">{t("backup")}</span>
      <div className="flex gap-2.5">
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-xs uppercase tracking-wide font-semibold text-muted hover:text-ink hover:border-brass/50 transition"
        >
          <Download className="h-3.5 w-3.5" />
          {t("exportJson")}
        </button>
        <button
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-xs uppercase tracking-wide font-semibold text-muted hover:text-ink hover:border-brass/50 transition disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          {t("importJson")}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
