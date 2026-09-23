"use client";

import { useEffect } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-3 text-center py-16 px-4">
      <div className="h-14 w-14 rounded-full bg-ember/15 text-ember flex items-center justify-center">
        <WifiOff className="h-6 w-6" />
      </div>
      <p className="text-base font-semibold text-ink">No se pudo cargar</p>
      <p className="text-sm text-muted max-w-xs">
        No pudimos conectar con la base de datos. Puede ser tu conexión o un problema momentáneo del servidor.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 flex items-center gap-2 rounded-xl border border-brass/40 bg-brass/10 px-4 py-2.5 text-xs uppercase tracking-wide font-semibold text-brass hover:brightness-110 transition active:scale-95"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Reintentar
      </button>
    </div>
  );
}
