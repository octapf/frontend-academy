export function Callout({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="my-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/40">
      {title ? (
        <div className="mb-2 text-sm font-semibold text-amber-950 dark:text-amber-100">
          {title}
        </div>
      ) : null}
      <div className="text-sm text-amber-950/90 dark:text-amber-50/90 [&_a]:font-medium [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
