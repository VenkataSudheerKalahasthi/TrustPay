import { cn } from '@utils';
import { AlertCircle } from 'lucide-react';

export function FormWrapper({
  children,
  onSubmit,
  error,
  title,
  subtitle,
  className,
  ...props
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          onSubmit(e);
        }
      }}
      className={cn('flex flex-col gap-4 w-full', className)}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <h2 className="text-xl font-bold text-surface-900 font-display">{title}</h2>}
          {subtitle && <p className="text-xs text-surface-600 mt-1">{subtitle}</p>}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-danger-500/15 border border-danger-200 text-danger-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {children}
    </form>
  );
}

