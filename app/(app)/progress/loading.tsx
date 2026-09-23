export default function ProgressLoading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="card-base p-4 h-48 bg-border/40" />
      <div className="grid grid-cols-4 gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-border/40" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="aspect-[3/4] rounded-lg bg-border/40" />
        <div className="aspect-[3/4] rounded-lg bg-border/40" />
      </div>
      <div className="h-24 rounded-lg bg-border/40" />
    </div>
  );
}
