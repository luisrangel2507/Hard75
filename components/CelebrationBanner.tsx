import { Trophy } from "lucide-react";

export function CelebrationBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="card-base border-brass bg-gradient-to-br from-brass/15 via-ember/10 to-transparent p-5 flex items-center gap-4 animate-fade-in shadow-[0_6px_18px_rgba(255,107,69,0.2)]">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brass to-ember flex items-center justify-center shrink-0">
        <Trophy className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-brass font-semibold uppercase tracking-wide">{title}</p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
