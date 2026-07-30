import { Trophy } from "lucide-react";

export function CelebrationBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="card-base border-brass bg-gradient-to-br from-brass/20 to-transparent p-5 flex items-center gap-4 animate-fade-in">
      <div className="h-12 w-12 rounded-full bg-brass/20 border border-brass flex items-center justify-center shrink-0">
        <Trophy className="h-6 w-6 text-brass" />
      </div>
      <div>
        <p className="text-brass font-semibold uppercase tracking-wide">{title}</p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
