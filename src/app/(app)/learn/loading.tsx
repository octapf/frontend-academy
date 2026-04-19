export default function LearnLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <p className="h-4 w-full max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-700/80 dark:bg-zinc-900"
          />
        ))}
      </div>
    </div>
  );
}
