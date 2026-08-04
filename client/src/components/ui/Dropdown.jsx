import { useState, useRef, useEffect } from 'react';
import { cn } from '@utils';

export function Dropdown({ trigger, items = [], align = 'right', className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 w-48 z-dropdown bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="my-1 border-t border-surface-700/80" />;
            }
            const Icon = item.icon;

            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  setIsOpen(false);
                  if (item.onClick) {
                    item.onClick(e);
                  }
                }}
                className={cn(
                  'w-full px-4 py-2 text-xs text-left flex items-center gap-2.5 transition-colors font-medium',
                  item.danger
                    ? 'text-danger-400 hover:bg-danger-500/15'
                    : 'text-surface-200 hover:bg-surface-700/60 hover:text-surface-50'
                )}
              >
                {Icon && <Icon size={14} className="shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
