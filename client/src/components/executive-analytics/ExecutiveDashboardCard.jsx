export function ExecutiveDashboardCard({ title, value, changePercent, icon: Icon, color = 'sky' }) {
  const isPositive = changePercent >= 0;
  const colorMap = {
    sky: 'border-sky-500/20 text-sky-400 dark:text-primary-400 bg-sky-500/10',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10',
    purple: 'border-purple-500/20 text-purple-400 bg-purple-500/10',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/10',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {changePercent !== undefined && (
          <p className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? '↑ +' : '↓ '}{changePercent}% <span className="text-slate-500 font-normal">vs last period</span>
          </p>
        )}
      </div>
      {Icon && (
        <div className={`p-3.5 rounded-xl border ${colorMap[color] || colorMap.sky}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
