export default function DayLoading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-10 w-full rounded bg-border/40" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-border/40" />
        ))}
      </div>
      <div className="h-28 rounded-lg bg-border/40" />
      <div className="h-24 rounded-lg bg-border/40" />
      <div className="aspect-[3/4] rounded-lg bg-border/40" />
    </div>
  );
}
