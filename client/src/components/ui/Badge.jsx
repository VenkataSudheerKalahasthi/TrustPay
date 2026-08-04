import { cn } from '@utils';

/**
 * Badge Component
 *
 * @param {object} props
 * @param {'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'surface' | 'outline'} props.variant
 * @param {'sm' | 'md' | 'lg'} props.size
 * @param {React.ReactNode} props.dot — colored dot indicator
 */
export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot,
  className,
  ...props
}) {
  const variantStyles = {
    primary: 'bg-primary-500/15 text-primary-400 border border-primary-500/30',
    secondary: 'bg-secondary-500/15 text-secondary-400 border border-secondary-500/30',
    success: 'bg-success-500/15 text-success-400 border border-success-500/30',
    warning: 'bg-warning-500/15 text-warning-500 border border-warning-500/30',
    danger: 'bg-danger-500/15 text-danger-400 border border-danger-500/30',
    surface: 'bg-surface-700/50 text-surface-300 border border-surface-600/50',
    outline: 'bg-transparent text-surface-300 border border-surface-600',
  };

  const sizeStyles = {
    sm: 'text-2xs px-1.5 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-0.5 rounded-full gap-1.5',
    lg: 'text-sm px-3 py-1 rounded-full gap-2',
  };

  const dotColors = {
    primary: 'bg-primary-400',
    secondary: 'bg-secondary-400',
    success: 'bg-success-400',
    warning: 'bg-warning-500',
    danger: 'bg-danger-400',
    surface: 'bg-surface-400',
    outline: 'bg-surface-400',
  };

  return (
    <span
      className={cn(
        'badge inline-flex items-center font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full flex-shrink-0',
            dotColors[variant],
            size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5'
          )}
        />
      )}
      {children}
    </span>
  );
}
