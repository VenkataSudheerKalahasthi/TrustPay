export const themeService = {
  getTheme: () => (typeof localStorage !== 'undefined' ? localStorage.getItem('tp_theme') || 'dark' : 'dark'),
  setTheme: (theme) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tp_theme', theme);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },
};
