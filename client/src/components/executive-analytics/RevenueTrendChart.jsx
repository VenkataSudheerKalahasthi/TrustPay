import { TrendingUp } from 'lucide-react';

export function RevenueTrendChart({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            {analytics.title}
          </h3>
          <p className="text-xs text-slate-400">Escrow volumes, commission yield, and subscription revenue trajectory</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          +51.1% YoY
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-2">
        {analytics.categories.map((cat, idx) => (
          <div key={cat} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">{cat}</p>
            <p className="text-base font-bold text-white">
              ₹{(analytics.series[0].data[idx] || 0).toLocaleString()}
            </p>
            <p className="text-xs text-emerald-400 font-mono">
              Net: ₹{(analytics.series[1].data[idx] || 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
