import { cn } from '@utils';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-surface-700/80 bg-surface-800/20 max-w-md mx-auto my-6',
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-surface-800 text-surface-400 border border-surface-700 mb-4 shadow-sm">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-semibold text-surface-100 font-display">{title}</h3>
      <p className="text-xs text-surface-400 mt-1 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
