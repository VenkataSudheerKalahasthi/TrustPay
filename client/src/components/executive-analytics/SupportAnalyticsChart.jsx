import { Headset } from 'lucide-react';

export function SupportAnalyticsChart({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Headset className="w-5 h-5 text-amber-400" />
        {analytics.title}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {analytics.series.map((item) => (
          <div key={item.label} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">{item.label}</p>
            <p className="text-2xl font-bold text-white">{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
