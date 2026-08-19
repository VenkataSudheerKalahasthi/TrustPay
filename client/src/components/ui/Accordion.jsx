import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils';
import { ChevronDown } from 'lucide-react';

export function Accordion({ items = [], allowMultiple = false, className }) {
  const [openIndices, setOpenIndices] = useState([0]);

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="border border-surface-300/60 rounded-2xl bg-surface-100/40 backdrop-blur-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-surface-900 font-medium hover:bg-surface-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon size={18} className="text-primary-600 shrink-0" />}
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
              <ChevronDown
                size={18}
                className={cn('text-surface-600 transition-transform duration-200', isOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-5 pb-4 pt-1 text-sm text-surface-700 border-t border-surface-300/40">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

