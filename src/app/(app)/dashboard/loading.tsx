export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <p className="h-4 w-full max-w-lg animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-36 animate-pulse rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-700/80 dark:bg-zinc-900" />
      <div className="h-24 animate-pulse rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-700/80 dark:bg-zinc-900" />
    </div>
  );
}
