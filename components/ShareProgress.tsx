"use client";

import { useState } from "react";
import { Share2, Loader2 } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export function ShareProgress({
  dayNumber,
  streak,
  photoUrl,
}: {
  dayNumber: number;
  streak: number;
  photoUrl: string | null;
}) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    try {
      const width = 1080;
      const height = 1350;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#FBF6EC");
      gradient.addColorStop(1, "#F3E7D2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (photoUrl) {
        const img = await loadImage(photoUrl);
        const photoTop = 260;
        const photoHeight = 760;
        const scale = Math.max(width / img.width, photoHeight / img.height);
        const sw = width / scale;
        const sh = photoHeight / scale;
        const sx = (img.width - sw) / 2;
        const sy = (img.height - sh) / 2;
        ctx.save();
        roundRect(ctx, 60, photoTop, width - 120, photoHeight, 32);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh, 60, photoTop, width - 120, photoHeight);
        ctx.restore();
      }

      ctx.fillStyle = "#28211A";
      ctx.font = "700 64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("75 RISE", width / 2, 140);

      const sunset = ctx.createLinearGradient(0, 0, 0, 40);
      sunset.addColorStop(0, "#FFC94D");
      sunset.addColorStop(1, "#FF3D7F");
      ctx.fillStyle = sunset;
      ctx.font = "600 32px sans-serif";
      ctx.fillText("EVERY DAMN DAY.", width / 2, 190);

      ctx.fillStyle = "#FF6B45";
      ctx.font = "700 96px sans-serif";
      ctx.fillText(`DÍA ${dayNumber}`, width / 2, height - 120);

      ctx.fillStyle = "#28211A";
      ctx.font = "600 40px sans-serif";
      ctx.fillText(`🔥 ${streak} días de racha`, width / 2, height - 60);

      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `75-rise-day-${dayNumber}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={generate}
      disabled={busy}
      className="flex items-center justify-center gap-2 rounded-md border border-brass/40 bg-brass/10 py-2.5 text-xs uppercase tracking-wide font-semibold text-brass hover:brightness-110 transition active:scale-95 disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
      {t("shareProgress")}
    </button>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
