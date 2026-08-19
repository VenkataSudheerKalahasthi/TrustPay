export function EnterpriseCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`glass-card space-y-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 border-b border-surface-200">
          <div>
            {title && <h3 className="text-lg font-bold text-surface-900 font-display">{title}</h3>}
            {subtitle && <p className="text-xs text-surface-600">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

