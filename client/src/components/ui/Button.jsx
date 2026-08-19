import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@utils';

const variantStyles = {
  primary:
    'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-glow-sm hover:shadow-glow focus-visible:ring-primary-500',
  secondary:
    'bg-surface-800 hover:bg-surface-700 active:bg-surface-600 text-surface-100 border border-surface-700 focus-visible:ring-primary-500',
  outline:
    'border border-surface-700 bg-transparent text-surface-200 hover:bg-surface-800 hover:text-surface-50 hover:border-surface-600 focus-visible:ring-primary-500',
  ghost:
    'bg-transparent text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 focus-visible:ring-primary-500',
  danger:
    'bg-danger-500 hover:bg-danger-600 active:bg-danger-700 text-white shadow-sm focus-visible:ring-danger-500',
  success:
    'bg-success-500 hover:bg-success-600 active:bg-success-700 text-white shadow-sm focus-visible:ring-success-500',
  gradient:
    'bg-gradient-brand hover:opacity-95 text-white shadow-glow-sm hover:shadow-glow focus-visible:ring-primary-500',
};

const sizeStyles = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
  xl: 'px-6 py-3 text-base rounded-2xl gap-3 font-semibold',
};

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const disabled = isDisabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
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
