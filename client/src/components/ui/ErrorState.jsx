import { cn } from '@utils';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load information. Please try again.',
  onRetry,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-danger-500/30 bg-danger-500/10 max-w-md mx-auto my-6',
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-danger-500/20 text-danger-400 border border-danger-500/30 mb-4 shadow-sm">
        <AlertCircle size={28} />
      </div>
      <h3 className="text-base font-semibold text-surface-100 font-display">{title}</h3>
      <p className="text-xs text-surface-300 mt-1 max-w-xs">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 border-danger-500/50 text-danger-300 hover:bg-danger-500/20"
          leftIcon={<RotateCcw size={14} />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
