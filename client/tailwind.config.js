/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── TrustPay Brand & Semantic Colors ──────────────────────────────────────────
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        secondary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        accent: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        danger: {
          50: '#FDECEC',
          100: '#F9CFCE',
          400: '#E5534B',
          500: '#D93025', // Danger Red
          600: '#B3261E',
          700: '#8C1D18',
        },
        warning: {
          50: '#FFF7E0',
          100: '#FEEAA8',
          400: '#F7C633',
          500: '#F4B400', // Warning Yellow
          600: '#C79200',
          700: '#997000',
        },
        success: {
          50: '#E8F7F0',
          100: '#C5EFE0',
          400: '#38C18C',
          500: '#22A06B', // Success Green
          600: '#1A8055',
          700: '#136040',
        },
        info: {
          50: '#E8F0FE',
          100: '#C2D7FE',
          400: '#5C97F5',
          500: '#4285F4', // Info Blue
          600: '#2A66C8',
        },
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // ─── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        sidebar: '16rem',
        'sidebar-collapsed': '4.5rem',
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        '5xl': '2rem',
      },

      // ─── Box Shadow ───────────────────────────────────────────────────────
      boxShadow: {
        card: '0 2px 8px -2px rgba(20, 33, 61, 0.06), 0 1px 4px -1px rgba(20, 33, 61, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(20, 33, 61, 0.08), 0 4px 12px -2px rgba(20, 33, 61, 0.04)',
        modal: '0 20px 40px -8px rgba(20, 33, 61, 0.16), 0 8px 16px -4px rgba(20, 33, 61, 0.08)',
        'glow-sm': '0 0 10px rgba(14, 165, 233, 0.15)',
        glow: '0 0 20px rgba(26, 115, 232, 0.2)',
        'glow-lg': '0 0 40px rgba(26, 115, 232, 0.3)',
      },

      // ─── Background Image ─────────────────────────────────────────────────
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)',
        'gradient-hero': 'linear-gradient(180deg, #F4F8FF 0%, #F8FAFD 100%)',
        'gradient-card': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFD 100%)',
      },

      // ─── Animation ────────────────────────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // ─── Z-Index ──────────────────────────────────────────────────────────
      zIndex: {
        navbar: '100',
        sidebar: '90',
        modal: '200',
        tooltip: '300',
        toast: '400',
      },

      // ─── Screens ──────────────────────────────────────────────────────────
      screens: {
        xs: '375px',
        '3xl': '1920px',
      },

      // ─── Backdrop Blur ────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
