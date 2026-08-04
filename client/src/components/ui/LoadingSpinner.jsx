import { cn } from '@utils';

/**
 * Loading Spinner Component
 *
 * @param {object} props
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} props.size
 * @param {string} props.className
 * @param {'primary' | 'white' | 'surface'} props.color
 */
export function LoadingSpinner({ size = 'md', color = 'primary', className }) {
  const sizeMap = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
    xl: 'h-12 w-12 border-4',
  };

  const colorMap = {
    primary: 'border-primary-500/30 border-t-primary-500',
    white: 'border-white/30 border-t-white',
    surface: 'border-surface-600/30 border-t-surface-400',
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('block rounded-full animate-spin', sizeMap[size], colorMap[color], className)}
    />
  );
}

/**
 * Full-page or section loading overlay.
 */
export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-modal flex flex-col items-center justify-center bg-surface-950/80 backdrop-blur-sm">
      <LoadingSpinner size="xl" />
      {message && <p className="mt-4 text-surface-400 text-sm">{message}</p>}
    </div>
  );
}
