import { cn } from '@utils';
import { AlertCircle } from 'lucide-react';

export function ValidationMessage({ message, className }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className={cn('text-xs text-danger-600 flex items-center gap-1 font-medium', className)}>
      <AlertCircle size={12} className="shrink-0" />
      <span>{message}</span>
    </p>
  );
}

