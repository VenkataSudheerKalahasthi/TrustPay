import { ShoppingBag } from 'lucide-react';

export function MarketplaceAnalyticsChart({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-sky-400" />
        {analytics.title}
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {analytics.categories.map((cat, idx) => (
          <div key={cat} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">{cat}</p>
            <p className="text-sm text-slate-300">Jobs: <strong className="text-white">{analytics.series[0].data[idx]}</strong></p>
            <p className="text-sm text-slate-300">Contracts: <strong className="text-sky-400">{analytics.series[1].data[idx]}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
