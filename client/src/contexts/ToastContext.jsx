import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', message, title, duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, message, title, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = 'Success', duration = 4000) =>
      addToast({ type: 'success', message, title, duration }),
    [addToast]
  );

  const error = useCallback(
    (message, title = 'Error', duration = 5000) =>
      addToast({ type: 'error', message, title, duration }),
    [addToast]
  );

  const warning = useCallback(
    (message, title = 'Warning', duration = 4000) =>
      addToast({ type: 'warning', message, title, duration }),
    [addToast]
  );

  const info = useCallback(
    (message, title = 'Information', duration = 4000) =>
      addToast({ type: 'info', message, title, duration }),
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
