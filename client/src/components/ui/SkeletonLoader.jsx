import { cn } from '@utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-surface-300 dark:bg-surface-700/50', className)}
      {...props}
    />
  );
}

Skeleton.Text = function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-4 w-full', i === lines - 1 && 'w-3/4')} />
      ))}
    </div>
  );
};

Skeleton.Card = function SkeletonCard({ className }) {
  return (
    <div className={cn('p-6 rounded-2xl bg-white dark:bg-surface-800/40 border border-surface-400 dark:border-surface-700/50 flex flex-col gap-4 shadow-sm', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton.Text lines={2} />
    </div>
  );
};

Skeleton.Table = function SkeletonTable({ rows = 5, columns = 4, className }) {
  return (
    <div className={cn('w-full rounded-2xl border border-surface-400 dark:border-surface-700/50 bg-white dark:bg-surface-800/40 p-4 flex flex-col gap-3 shadow-sm', className)}>
      <div className="flex items-center gap-4 border-b border-surface-300 dark:border-surface-700/60 pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 py-2">
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

Skeleton.Form = function SkeletonForm({ fields = 4, className }) {
  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 mt-2" />
    </div>
  );
};
