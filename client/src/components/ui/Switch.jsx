import { forwardRef } from 'react';
import { cn } from '@utils';

const Switch = forwardRef(
  (
    {
      label,
      description,
      checked,
      onChange,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-center justify-between gap-4 select-none">
        {(label || description) && (
          <label htmlFor={inputId} className="cursor-pointer text-sm flex-1">
            {label && <span className="font-medium text-surface-800 block">{label}</span>}
            {description && <span className="text-xs text-surface-600 block">{description}</span>}
          </label>
        )}

        <div className="relative inline-flex items-center shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            onClick={() => !disabled && onChange && onChange({ target: { checked: !checked } })}
            className={cn(
              'w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer p-0.5',
              checked ? 'bg-primary-600' : 'bg-surface-700',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full bg-card shadow-md transition-transform duration-200',
                checked && 'translate-x-5'
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };

