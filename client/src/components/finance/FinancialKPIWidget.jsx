export function FinancialKPIWidget({ title, value, subtitle, icon: Icon, color = 'sky' }) {
  const colorMap = {
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const style = colorMap[color] || colorMap.sky;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{title}</span>
        <h3 className="text-3xl font-black text-white mt-1 font-mono">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
      </div>

      {Icon && (
        <div className={`p-3.5 rounded-2xl border ${style}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
