import { useState, useMemo } from 'react';

/**
 * In-memory client-side array search and filtering hook.
 *
 * @param {Array} items - Array of objects to search through
 * @param {Array<string>} keys - Properties to match against
 */
export function useSearch(items = [], keys = []) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }
    const query = searchTerm.toLowerCase();

    return items.filter((item) => {
      if (!item) {
        return false;
      }
      if (keys.length === 0) {
        return JSON.stringify(item).toLowerCase().includes(query);
      }
      return keys.some((key) => {
        const val = item[key];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(query);
      });
    });
  }, [items, keys, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    hasResults: filteredItems.length > 0,
  };
}
