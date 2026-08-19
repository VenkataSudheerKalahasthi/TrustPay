import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
        ${isDark 
          ? 'bg-surface-400 border border-primary-400 hover:bg-surface-200 shadow-[0_0_10px_rgba(0,210,106,0.15)] hover:shadow-[0_0_15px_rgba(0,210,106,0.3)]' 
          : 'bg-card border border-surface-200 hover:bg-surface-50 hover:border-surface-300 shadow-sm hover:shadow hover:-translate-y-[1px]'
        }
      `}
    >
      {isDark ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-surface-900" />
      )}
    </button>
  );
}
