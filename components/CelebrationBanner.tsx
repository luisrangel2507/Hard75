import { Trophy } from "lucide-react";

export function CelebrationBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="card-base bg-card p-5 flex items-center gap-4 animate-fade-in">
      <div className="h-12 w-12 rounded-full bg-brass flex items-center justify-center shrink-0">
        <Trophy className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-brass font-semibold ">{title}</p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
