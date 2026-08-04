import { forwardRef } from 'react';
import { cn } from '@utils';
import { Check } from 'lucide-react';

const Checkbox = forwardRef(
  (
    {
      label,
      description,
      error,
      className,
      id,
      checked,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-3 select-none">
        <div className="relative flex items-center mt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer',
              'bg-surface-800 border-surface-700 peer-checked:bg-primary-600 peer-checked:border-primary-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-950',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-danger-500',
              className
            )}
          >
            <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>

        {(label || description) && (
          <label htmlFor={inputId} className="cursor-pointer text-sm">
            {label && <span className="font-medium text-surface-200 block">{label}</span>}
            {description && <span className="text-xs text-surface-400 block">{description}</span>}
            {error && <span className="text-xs text-danger-400 block mt-0.5">{error}</span>}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
