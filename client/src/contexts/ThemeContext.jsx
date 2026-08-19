import { createContext, useContext, useMemo } from 'react';

const ThemeContext = createContext(null);

/**
 * Restored ThemeProvider
 * Operates in fixed dark mode as per pre-today UI architecture.
 * Removes light theme toggling, dynamic light overrides, and today's light theme persistence.
 */
export function ThemeProvider({ children }) {
  const value = useMemo(
    () => ({
      theme: 'dark',
      isDark: true,
      isLight: false,
      setTheme: () => {},
      toggleTheme: () => {},
    }),
    []
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'dark',
      isDark: true,
      isLight: false,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}
