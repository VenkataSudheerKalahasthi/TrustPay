import { useState, useEffect } from 'react';
import { cn } from '@utils';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@hooks/useDebounce';

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  debounceDelay = 300,
  className,
}) {
  const [internalValue, setInternalValue] = useState(value || '');
  const debouncedValue = useDebounce(internalValue, debounceDelay);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search size={16} className="absolute left-3.5 text-surface-400 pointer-events-none" />
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-surface-800/80 border border-surface-700 rounded-xl pl-10 pr-9 py-2 text-sm text-surface-50 placeholder:text-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-surface-400 hover:text-surface-200 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
