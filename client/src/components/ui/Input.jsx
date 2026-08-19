import { forwardRef } from 'react';
import { cn } from '@utils';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      required,
      type = 'text',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-surface-600 uppercase tracking-wider">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-surface-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(
              'w-full bg-card dark:bg-[#07100B] border border-surface-300 dark:border-[rgba(255,255,255,0.10)] rounded-xl px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-600 transition-all duration-200 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-surface-500 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-danger-500 font-medium mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-surface-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

