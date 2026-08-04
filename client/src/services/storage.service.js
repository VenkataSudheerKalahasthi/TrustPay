/**
 * Storage Service
 * Safe wrapper for browser localStorage and sessionStorage with JSON parsing.
 */
export const storageService = {
  get(key, defaultValue = null) {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },

  clear() {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.clear();
    } catch {
      // Ignore
    }
  },

  getSession(key, defaultValue = null) {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setSession(key, value) {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  removeSession(key) {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};
