import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { STORAGE_KEYS } from '@constants';

/**
 * Enterprise Design System Tokens
 * Centralized reference for colors, typography, border radius, shadows, and spacing.
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    surface: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    display: 'Outfit, Inter, sans-serif',
    mono: 'JetBrains Mono, Fira Code, monospace',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
  shadows: {
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
    card: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
};

const ThemeContext = createContext(null);

/**
 * Centralized Global ThemeProvider
 * Manages dark/light mode preference and exposes design system tokens.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
      setTheme,
      toggleTheme,
      tokens: DESIGN_TOKENS,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
