import { useState } from 'react';
import { cn } from '@utils';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function FilterPanel({
  title = 'Filters',
  children,
  onReset,
  onApply,
  activeCount = 0,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<Filter size={16} />}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{title}</span>
        {activeCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-500 text-white text-2xs font-bold">
            {activeCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-dropdown bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-700 pb-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-primary-400" />
              <span className="font-semibold text-sm text-surface-100">{title}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-surface-400 hover:text-surface-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">{children}</div>

          <div className="flex items-center justify-between border-t border-surface-700 pt-3 gap-2">
            {onReset && (
              <Button
                variant="ghost"
                size="xs"
                leftIcon={<RotateCcw size={12} />}
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
              >
                Reset
              </Button>
            )}
            <Button
              variant="primary"
              size="xs"
              className="ml-auto"
              onClick={() => {
                if (onApply) {
                  onApply();
                }
                setIsOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
