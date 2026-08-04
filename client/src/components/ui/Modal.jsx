import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOutsideClick = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOutsideClick ? onClose : undefined}
            className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]',
              sizeMap[size]
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="px-6 py-4 border-b border-surface-700/80 flex items-start justify-between">
                <div>
                  {title && (
                    <h2 className="text-lg font-semibold font-display text-surface-100">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs text-surface-400 mt-0.5">{description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-surface-400 hover:text-surface-100 p-1 rounded-lg hover:bg-surface-700 transition-colors ml-4"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1 text-surface-200">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-3.5 bg-surface-800/90 border-t border-surface-700/80 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
