export function EnterpriseBadge({ children, variant = 'info', className = '' }) {
  const variantStyles = {
    info: 'bg-primary-100 text-primary-600 border-primary-100 dark:bg-primary-950/40 dark:text-primary-700',
    success: 'bg-success-50 text-success-600 border-success-200 dark:bg-success-950/40 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-600 border-warning-500/30 dark:bg-warning-950/40 dark:text-warning-300',
    danger: 'bg-danger-50 text-danger-600 border-danger-200 dark:bg-danger-950/40 dark:text-danger-300',
    purple: 'bg-secondary-100 text-secondary-600 border-secondary-500/20 dark:bg-secondary-950/40 dark:text-secondary-300',
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${variantStyles[variant] || variantStyles.info} ${className}`}>
      {children}
    </span>
  );
}

