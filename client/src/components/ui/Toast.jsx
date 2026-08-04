import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '@hooks/useToast';

export function Toast({ id, type = 'info', title, message, onClose }) {
  const icons = {
    success: <CheckCircle2 size={18} className="text-success-400 shrink-0" />,
    error: <AlertCircle size={18} className="text-danger-400 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-warning-400 shrink-0" />,
    info: <Info size={18} className="text-primary-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-success-500/30 bg-success-500/10',
    error: 'border-danger-500/30 bg-danger-500/10',
    warning: 'border-warning-500/30 bg-warning-500/10',
    info: 'border-primary-500/30 bg-primary-500/10',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'w-80 p-3.5 rounded-2xl border backdrop-blur-md bg-surface-900/90 text-surface-100 shadow-2xl flex items-start gap-3 pointer-events-auto',
        borderColors[type]
      )}
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-xs font-semibold text-surface-100">{title}</h4>}
        <p className="text-xs text-surface-300 mt-0.5 leading-relaxed">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="text-surface-400 hover:text-surface-100 transition-colors p-0.5"
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-toast flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
