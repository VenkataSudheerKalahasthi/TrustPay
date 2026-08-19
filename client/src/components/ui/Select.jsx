import { forwardRef } from 'react';
import { cn } from '@utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      options = [],
      placeholder = 'Select an option',
      error,
      hint,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-surface-600 uppercase tracking-wider flex items-center gap-1">
            {label}
            {props.required && <span className="text-danger-500 text-xs">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-card border rounded-xl px-4 py-2.5 pr-10 text-sm text-surface-900 appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer shadow-sm',
              error
                ? 'border-danger-500 focus:ring-danger-500/20'
                : 'border-surface-300 focus:border-primary-600 focus:ring-primary-500/20',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-card text-surface-600">
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val} className="bg-card text-surface-900">
                  {lbl}
                </option>
              );
            })}
          </select>
          <ChevronDown size={16} className="absolute right-3.5 text-surface-500 pointer-events-none" />
        </div>

        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-danger-600 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-surface-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };

