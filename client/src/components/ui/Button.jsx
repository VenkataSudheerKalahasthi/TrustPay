import { forwardRef } from 'react';
import { cn } from '@utils';

/**
 * Shared Button Component
 *
 * Supports multiple variants, sizes, loading state, and icon slots.
 * Built with Tailwind and Framer Motion-ready structure.
 *
 * @param {object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'} props.variant
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} props.size
 * @param {boolean} props.loading
 * @param {boolean} props.fullWidth
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightIcon
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 select-none whitespace-nowrap';

    const variantStyles = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 shadow-sm hover:shadow-glow disabled:bg-primary-900 disabled:text-primary-600',
      secondary:
        'bg-secondary-600 text-white hover:bg-secondary-500 active:bg-secondary-700 shadow-sm hover:shadow-lg disabled:bg-secondary-900 disabled:text-secondary-600',
      outline:
        'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 active:bg-primary-500/20 disabled:border-surface-700 disabled:text-surface-600',
      ghost:
        'text-surface-300 hover:bg-surface-800 hover:text-surface-100 active:bg-surface-700 disabled:text-surface-600',
      danger:
        'bg-danger-600 text-white hover:bg-danger-500 active:bg-danger-700 shadow-sm disabled:bg-danger-900 disabled:text-danger-600',
      success:
        'bg-success-600 text-white hover:bg-success-500 active:bg-success-700 shadow-sm disabled:bg-success-900 disabled:text-success-600',
      gradient:
        'bg-gradient-brand text-white hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-glow',
    };

    const sizeStyles = {
      xs: 'h-7 px-3 text-xs rounded-lg',
      sm: 'h-8 px-4 text-sm rounded-lg',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg rounded-2xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'cursor-not-allowed opacity-60',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
