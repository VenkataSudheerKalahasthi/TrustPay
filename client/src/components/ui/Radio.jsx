import { forwardRef } from 'react';
import { cn } from '@utils';

const Radio = forwardRef(
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
            type="radio"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer',
              'bg-surface-800 border-surface-700 peer-checked:border-primary-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-950',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-danger-500',
              className
            )}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>

        {(label || description) && (
          <label htmlFor={inputId} className="cursor-pointer text-sm">
            {label && <span className="font-medium text-surface-200 block">{label}</span>}
            {description && <span className="text-xs text-surface-400 block">{description}</span>}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export function RadioGroup({ children, label, error, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className="text-sm font-medium text-surface-200">{label}</span>}
      <div className="flex flex-col gap-2">{children}</div>
      {error && <span className="text-xs text-danger-400">{error}</span>}
    </div>
  );
}

export { Radio };
