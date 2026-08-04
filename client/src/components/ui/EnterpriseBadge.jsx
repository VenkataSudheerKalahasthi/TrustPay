export function EnterpriseBadge({ children, variant = 'info', className = '' }) {
  const variantStyles = {
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${variantStyles[variant] || variantStyles.info} ${className}`}>
      {children}
    </span>
  );
}
