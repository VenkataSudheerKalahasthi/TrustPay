export function EnterpriseCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`glass-card space-y-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 border-b border-surface-800">
          <div>
            {title && <h3 className="text-lg font-bold text-surface-50 font-display">{title}</h3>}
            {subtitle && <p className="text-xs text-surface-400">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
