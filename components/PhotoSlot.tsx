"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { compressImageToDataUrl } from "@/lib/imageCompress";

export function PhotoSlot({
  label,
  currentUrl,
  onChange,
  aspect = "square",
}: {
  label: string;
  currentUrl: string | null;
  onChange: (url: string | null) => void;
  aspect?: "square" | "portrait";
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      onChange(dataUrl);
    } catch {
      setError("error");
    } finally {
      setBusy(false);
    }
  }

  function handleRemove() {
    if (!confirm(t("confirmRemovePhoto"))) return;
    onChange(null);
  }

  const aspectClass = aspect === "portrait" ? "aspect-[3/4]" : "aspect-square";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="label-caps">{label}</span>
      <div
        className={`relative rounded-2xl border overflow-hidden ${aspectClass} ${
          currentUrl ? "border-brass shadow-[0_4px_14px_rgba(255,107,69,0.18)]" : "border-border border-dashed"
        } bg-card`}
      >
        {currentUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUrl} alt={label} className="absolute inset-0 h-full w-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-bg/80 border border-border flex items-center justify-center text-ink hover:text-ember transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="h-full w-full flex flex-col items-center justify-center gap-1.5 text-muted hover:text-brass transition"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Camera className="h-5 w-5" />
                <span className="text-[10px] uppercase tracking-wide">{t("uploadPhoto")}</span>
              </>
            )}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-ember">{error}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
