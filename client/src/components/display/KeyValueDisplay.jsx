import { cn } from '@utils';

export function KeyValueDisplay({ items = [], cols = 2, className }) {
  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', colMap[cols], className)}>
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-surface-400">{item.label}</span>
          <span className="text-sm font-semibold text-surface-100">{item.value ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}
