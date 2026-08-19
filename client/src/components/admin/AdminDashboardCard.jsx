export function AdminDashboardCard({ title, value, subtitle, icon: Icon, _trend }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-bold text-white font-mono">{value}</div>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {Icon && (
        <div className="p-3 bg-sky-500/10 text-sky-400 dark:text-primary-400 rounded-xl border border-sky-500/20">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
