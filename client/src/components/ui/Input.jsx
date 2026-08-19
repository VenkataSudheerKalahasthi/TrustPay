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
          <label htmlFor={id} className="block text-xs font-semibold text-surface-200 uppercase tracking-wider">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-surface-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(
              'w-full bg-surface-900 border border-surface-800 rounded-xl px-3.5 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-surface-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-danger-500 font-medium mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-surface-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
