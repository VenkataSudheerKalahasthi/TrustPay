import { forwardRef } from 'react';

export const EnterpriseButton = forwardRef(function EnterpriseButton(
  { children, variant = 'primary', size = 'md', isLoading = false, icon: Icon, className = '', disabled, ...props },
  ref
) {
  const variantStyles = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700',
    outline: 'border border-sky-500/50 text-sky-400 hover:bg-sky-500/10 font-semibold',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/20',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800 font-medium',
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
      className={`inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
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
