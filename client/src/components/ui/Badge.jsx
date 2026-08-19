import { cn } from '@utils';

const variantStyles = {
  primary: 'bg-primary-50 text-primary-700 border border-primary-200',
  secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
  accent: 'bg-success-50 text-success-700 border border-success-200',
  success: 'bg-success-50 text-success-700 border border-success-200',
  warning: 'bg-warning-50 text-warning-700 border border-warning-200',
  danger: 'bg-danger-50 text-danger-700 border border-danger-200',
  neutral: 'bg-surface-100 text-surface-700 border border-surface-200',
};

const dotColors = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  accent: 'bg-success-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  neutral: 'bg-surface-500',
};


export function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'badge transition-colors duration-200',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0 animate-pulse',
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
