"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { compressImage } from "@/lib/imageCompress";

export function PhotoSlot({
  dayNumber,
  slot,
  label,
  currentUrl,
  onChange,
  aspect = "square",
}: {
  dayNumber: number;
  slot: "progress" | "breakfast" | "lunch" | "dinner";
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
      const compressed = await compressImage(file);
      const presignRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber, slot, contentType: "image/jpeg" }),
      });
      if (!presignRes.ok) throw new Error("presign failed");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: compressed,
      });
      if (!putRes.ok) throw new Error("upload failed");

      onChange(publicUrl);
    } catch {
      setError("error");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    if (!confirm(t("confirmRemovePhoto"))) return;
    setBusy(true);
    try {
      await fetch("/api/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber, slot }),
      });
      onChange(null);
    } finally {
      setBusy(false);
    }
  }

  const aspectClass = aspect === "portrait" ? "aspect-[3/4]" : "aspect-square";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="label-caps">{label}</span>
      <div
        className={`relative rounded-lg border overflow-hidden ${aspectClass} ${
          currentUrl ? "border-brass" : "border-border border-dashed"
        } bg-card`}
      >
        {currentUrl ? (
          <>
            <Image src={currentUrl} alt={label} fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-bg/80 border border-border flex items-center justify-center text-ink hover:text-ember transition"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
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
