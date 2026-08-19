import { cn } from '@utils';
import { ValidationMessage } from './ValidationMessage';

export function FormField({
  label,
  required,
  error,
  hint,
  children,
  className,
  id,
}) {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-surface-800 flex items-center gap-1">
          {label}
          {required && <span className="text-danger-500 text-xs">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <ValidationMessage message={error} />
      ) : hint ? (
        <p className="text-xs text-surface-500">{hint}</p>
      ) : null}
    </div>
  );
}

