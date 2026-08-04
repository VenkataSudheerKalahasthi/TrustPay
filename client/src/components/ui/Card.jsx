import { cn } from '@utils';

/**
 * Card Component — Glassmorphism surface.
 *
 * @param {object} props
 * @param {'default' | 'elevated' | 'flat' | 'bordered'} props.variant
 * @param {boolean} props.hoverable
 * @param {boolean} props.padded
 */
export function Card({
  children,
  variant = 'default',
  hoverable = false,
  padded = true,
  className,
  ...props
}) {
  const variantStyles = {
    default: 'bg-surface-800/60 backdrop-blur-md border border-surface-700/50',
    elevated: 'bg-surface-800 border border-surface-700 shadow-card-hover',
    flat: 'bg-surface-800/30 border border-surface-700/30',
    bordered: 'bg-transparent border-2 border-primary-500/30',
  };

  return (
    <div
      className={cn(
        'rounded-2xl',
        variantStyles[variant],
        padded && 'p-6',
        hoverable &&
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-surface-100', className)} {...props}>
      {children}
    </h3>
  );
};

Card.Body = function CardBody({ children, className, ...props }) {
  return (
    <div className={cn('text-surface-300', className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-surface-700/50 flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};
