import { cn } from '@utils';
import { X } from 'lucide-react';

export function Chip({
  children,
  onRemove,
  onClick,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className,
}) {
  const variantMap = {
    default: 'bg-surface-800 text-surface-200 border-surface-700 hover:bg-surface-700',
    primary: 'bg-primary-500/15 text-primary-300 border-primary-500/30 hover:bg-primary-500/25',
    secondary: 'bg-secondary-500/15 text-secondary-300 border-secondary-500/30 hover:bg-secondary-500/25',
    success: 'bg-success-500/15 text-success-300 border-success-500/30 hover:bg-success-500/25',
    warning: 'bg-warning-500/15 text-warning-300 border-warning-500/30 hover:bg-warning-500/25',
    danger: 'bg-danger-500/15 text-danger-300 border-danger-500/30 hover:bg-danger-500/25',
  };

  const sizeMap = {
    sm: 'text-2xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-xl gap-2',
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center font-medium border transition-colors select-none',
        variantMap[variant],
        sizeMap[size],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" />}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-white transition-colors"
        >
          <X size={size === 'sm' ? 12 : 14} />
        </button>
      )}
    </span>
  );
}
