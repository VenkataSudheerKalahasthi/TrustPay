import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@utils';

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const borderStyles = {
  success: 'border-success-500/40 text-success-400 bg-surface-900',
  warning: 'border-warning-500/40 text-warning-400 bg-surface-900',
  error: 'border-danger-500/40 text-danger-400 bg-surface-900',
  info: 'border-primary-500/40 text-primary-400 bg-surface-900',
};

export function Toast({ type = 'info', message, onClose, className }) {
  const Icon = icons[type] || Info;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl animate-slide-up text-xs font-medium max-w-md w-full',
        borderStyles[type],
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={16} className="shrink-0" />
        <span className="text-surface-200">{message}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function ToastContainer() {
  return null;
}
