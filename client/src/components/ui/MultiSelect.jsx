import { useState, useRef, useEffect } from 'react';
import { cn } from '@utils';
import { X, ChevronDown, Check } from 'lucide-react';

export function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  error,
  hint,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    const isSelected = value.includes(optionValue);
    const updated = isSelected
      ? value.filter((val) => val !== optionValue)
      : [...value, optionValue];
    if (onChange) {
      onChange(updated);
    }
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    if (onChange) {
      onChange(value.filter((val) => val !== optionValue));
    }
  };

  const getOptionLabel = (val) => {
    const found = options.find((o) => (typeof o === 'object' ? o.value === val : o === val));
    if (!found) {
      return val;
    }
    return typeof found === 'object' ? found.label : found;
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 w-full relative">
      {label && <label className="text-sm font-medium text-surface-800">{label}</label>}

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'min-h-[42px] w-full bg-surface-100/80 border rounded-xl px-3 py-1.5 flex flex-wrap items-center gap-1.5 cursor-pointer transition-all duration-200',
          error ? 'border-danger-500' : 'border-surface-300 hover:border-surface-600',
          isOpen && 'ring-2 ring-primary-500 border-primary-600',
          className
        )}
      >
        {value.length === 0 ? (
          <span className="text-sm text-surface-500 px-1">{placeholder}</span>
        ) : (
          value.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 text-xs font-medium bg-primary-500/20 text-primary-700 border border-primary-600/30 px-2 py-0.5 rounded-md"
            >
              {getOptionLabel(val)}
              <button
                type="button"
                onClick={(e) => handleRemove(val, e)}
                className="hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}

        <ChevronDown size={16} className="ml-auto text-surface-600 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-dropdown bg-surface-50 border border-surface-300 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-surface-500">No options available</div>
          ) : (
            options.map((opt) => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLbl = typeof opt === 'object' ? opt.label : opt;
              const selected = value.includes(optVal);

              return (
                <div
                  key={optVal}
                  onClick={() => handleSelect(optVal)}
                  className={cn(
                    'px-4 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors',
                    selected
                      ? 'bg-primary-500/15 text-primary-700 font-medium'
                      : 'text-surface-800 hover:bg-surface-700/60'
                  )}
                >
                  <span>{optLbl}</span>
                  {selected && <Check size={16} className="text-primary-600" />}
                </div>
              );
            })
          )}
        </div>
      )}

      {error ? (
        <p className="text-xs text-danger-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-surface-500">{hint}</p>
      ) : null}
    </div>
  );
}

