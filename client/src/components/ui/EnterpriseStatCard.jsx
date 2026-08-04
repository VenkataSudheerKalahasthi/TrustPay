export function EnterpriseStatCard({ label, value, subtitle, icon: Icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
