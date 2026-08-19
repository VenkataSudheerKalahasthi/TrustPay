import { forwardRef } from 'react';

export const EnterpriseButton = forwardRef(function EnterpriseButton(
  { children, variant = 'primary', size = 'md', isLoading = false, icon: Icon, className = '', disabled, ...props },
  ref
) {
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold shadow-sm hover:shadow focus-visible:ring-primary-500',
    secondary: 'bg-surface-50 hover:bg-surface-700 text-surface-900 font-medium border border-surface-300 focus-visible:ring-primary-500',
    outline: 'border border-primary-600/50 text-primary-600 hover:bg-primary-50 font-semibold',
    danger: 'bg-danger-500 hover:bg-danger-600 active:bg-danger-700 text-white font-semibold shadow-sm focus-visible:ring-danger-500',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-50 font-medium',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
});

