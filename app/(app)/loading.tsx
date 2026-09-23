export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="card-base p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-24 w-24 rounded-full bg-border/60" />
          <div className="flex flex-col gap-2 items-end">
            <div className="h-6 w-16 rounded bg-border/60" />
            <div className="h-3 w-12 rounded bg-border/40" />
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-border/50" />
        <div className="h-9 w-full rounded-md bg-border/60" />
      </div>
      <div className="card-base p-4 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-border/40" />
        ))}
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-md bg-border/40" />
        ))}
      </div>
    </div>
  );
}
