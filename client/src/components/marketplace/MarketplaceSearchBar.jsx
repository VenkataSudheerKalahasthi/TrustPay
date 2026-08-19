import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function MarketplaceSearchBar({ value, onChange, placeholder = 'Search jobs by title, skills, or keywords...' }) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // 300ms Debounce Handler
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, onChange]);

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-600" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search opportunity catalog"
        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-surface-200 text-xs text-surface-900 placeholder-surface-500 focus:outline-none focus:border-primary-600"
      />
    </div>
  );
}

