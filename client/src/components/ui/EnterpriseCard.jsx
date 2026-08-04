export function EnterpriseCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
