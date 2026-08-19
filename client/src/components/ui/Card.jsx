import { cn } from '@utils';

export function Card({
  children,
  variant = 'default',
  hover = false,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'glass-card p-6 transition-all duration-200',
        variant === 'bordered' && 'border-surface-700 bg-surface-900',
        variant === 'gradient' && 'gradient-border bg-surface-900',
        hover && 'hover:border-primary-500 hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-between gap-4 pb-4 mb-4 border-b border-surface-800', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-lg font-bold text-surface-50 font-display tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-xs text-surface-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-between gap-4 pt-4 mt-4 border-t border-surface-800', className)}
      {...props}
    >
      {children}
    </div>
  );
}
