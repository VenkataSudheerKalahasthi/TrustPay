import { useState, useEffect } from 'react';

/**
 * Custom hook to sync state with window.localStorage.
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - Fallback value
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // Ignore write errors
      void error;
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
