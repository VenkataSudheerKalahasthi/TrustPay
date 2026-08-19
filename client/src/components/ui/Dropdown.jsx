import { useState, useRef, useEffect } from 'react';
import { cn } from '@utils';

export function Dropdown({ trigger, children, items, align = 'right', className }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50 w-56 rounded-xl bg-card border border-surface-200 shadow p-1.5 animate-slide-down',
            alignClasses[align],
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {items
            ? items.map((item, idx) => {
                if (item.divider) {
                  return <div key={idx} className="my-1 border-t border-surface-200" />;
                }
                return (
                  <DropdownItem
                    key={idx}
                    onClick={item.onClick}
                    icon={item.icon}
                    danger={item.danger}
                  >
                    {item.label}
                  </DropdownItem>
                );
              })
            : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, icon: Icon, danger = false, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left',
        danger
          ? 'text-danger-600 hover:bg-danger-50'
          : 'text-surface-700 hover:text-surface-900 hover:bg-surface-50',
        className
      )}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      <span>{children}</span>
    </button>
  );
}

