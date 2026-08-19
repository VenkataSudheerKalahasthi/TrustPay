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
        'flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-surface-200 bg-surface-50 shadow-sm max-w-md mx-auto my-6',
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-card text-primary-600 border border-surface-200 mb-4 shadow-sm">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-semibold text-surface-900 font-display">{title}</h3>
      <p className="text-xs text-surface-500 mt-1 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
