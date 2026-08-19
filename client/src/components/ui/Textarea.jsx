import { forwardRef } from 'react';
import { cn } from '@utils';
import { AlertCircle } from 'lucide-react';

const Textarea = forwardRef(
  (
    {
      label,
      error,
      hint,
      rows = 4,
      fullWidth = true,
      className,
      id,
      maxLength,
      value,
      showCount = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-surface-200 uppercase tracking-wider flex items-center gap-1">
            {label}
            {props.required && <span className="text-danger-500 text-xs">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            maxLength={maxLength}
            value={value}
            className={cn(
              'w-full bg-surface-900 border rounded-xl px-4 py-2.5 text-sm text-surface-50 placeholder:text-surface-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-y shadow-glow-sm',
              error
                ? 'border-danger-500 focus:ring-danger-500/20'
                : 'border-surface-800 focus:border-primary-500 focus:ring-primary-500/20',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          {error ? (
            <p id={`${inputId}-error`} role="alert" className="text-danger-400 flex items-center gap-1">
              <AlertCircle size={12} />
              {error}
            </p>
          ) : hint ? (
            <p id={`${inputId}-hint`} className="text-surface-500">
              {hint}
            </p>
          ) : (
            <span />
          )}

          {showCount && maxLength && (
            <span className="text-surface-500 ml-auto">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
