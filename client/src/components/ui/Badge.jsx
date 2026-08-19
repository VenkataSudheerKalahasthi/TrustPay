import { cn } from '@utils';

const variantStyles = {
  primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
  secondary: 'bg-secondary-500/10 text-secondary-400 border border-secondary-500/20',
  accent: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  neutral: 'bg-surface-800 text-surface-300 border border-surface-700',
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
