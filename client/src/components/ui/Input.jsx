import { forwardRef, useState } from 'react';
import { cn } from '@utils';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Shared Input Component
 *
 * Supports text, email, password (with toggle), number, textarea.
 * Integrates with React Hook Form via forwardRef.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.error
 * @param {string} props.hint
 * @param {boolean} props.success
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightElement
 * @param {boolean} props.fullWidth
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      success,
      leftIcon,
      rightElement,
      fullWidth = true,
      className,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const inputBaseStyles =
      'w-full bg-surface-800/80 border rounded-xl px-4 py-2.5 text-sm text-surface-50 placeholder:text-surface-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface-950 autofill:bg-surface-800';

    const inputStateStyles = error
      ? 'border-danger-500 focus:ring-danger-500'
      : success
        ? 'border-success-500 focus:ring-success-500'
        : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500';

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-200 flex items-center gap-1"
          >
            {label}
            {props.required && <span className="text-danger-500 text-xs">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-surface-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              inputBaseStyles,
              inputStateStyles,
              leftIcon && 'pl-10',
              (isPassword || rightElement || error || success) && 'pr-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 text-surface-400 hover:text-surface-200 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {/* Status Icons */}
          {!isPassword && error && (
            <AlertCircle
              size={16}
              className="absolute right-3.5 text-danger-500 pointer-events-none"
            />
          )}
          {!isPassword && success && !error && (
            <CheckCircle2
              size={16}
              className="absolute right-3.5 text-success-500 pointer-events-none"
            />
          )}

          {/* Custom right element */}
          {!isPassword && !error && !success && rightElement && (
            <span className="absolute right-3.5">{rightElement}</span>
          )}
        </div>

        {/* Hint text */}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-surface-500">
            {hint}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-danger-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
