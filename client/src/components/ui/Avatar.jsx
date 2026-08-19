import { cn } from '@utils';
import { User } from 'lucide-react';

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  status, // 'online' | 'offline' | 'busy' | 'away'
  className,
}) {
  const sizeMap = {
    xs: 'w-6 h-6 text-2xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusMap = {
    online: 'bg-success-500',
    offline: 'bg-surface-500',
    busy: 'bg-danger-500',
    away: 'bg-warning-500',
  };

  const getInitials = (n) => {
    if (!n) {
      return '';
    }
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'rounded-full bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center font-semibold overflow-hidden select-none',
          sizeMap[size],
          className
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="opacity-70" size={size === 'xs' ? 12 : size === 'sm' ? 16 : 20} />
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusMap[status],
            size === 'xs' || size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
          )}
        />
      )}
    </div>
  );
}
