import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils';
import { X } from 'lucide-react';

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = 'right',
  size = 'md',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeMap = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  const isLeft = position === 'left';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-card/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: isLeft ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'relative w-full bg-card border-surface-300 shadow-2xl flex flex-col z-10 h-full',
              isLeft ? 'mr-auto border-r' : 'ml-auto border-l',
              sizeMap[size]
            )}
          >
            {title && (
              <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between">
                <h3 className="font-semibold text-lg text-surface-900">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-surface-600 hover:text-surface-900 p-1 rounded-lg hover:bg-surface-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="p-6 overflow-y-auto flex-1">{children}</div>

            {footer && (
              <div className="p-4 border-t border-surface-200 bg-card/90">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

