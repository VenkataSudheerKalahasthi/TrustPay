import { Activity } from 'lucide-react';

export function TrendChart({ title = 'Historical KPI Velocity' }) {
  const points = [65, 70, 72, 78, 82, 85, 88, 92, 95];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          {title}
        </h3>
        <span className="text-xs text-emerald-400 font-mono font-bold">+18.5% Growth</span>
      </div>

      <div className="flex items-end gap-2 h-32 pt-4 border-t border-slate-800">
        {points.map((val, idx) => (
          <div key={idx} className="flex-1 bg-slate-800 rounded-t overflow-hidden relative group">
            <div
              className="bg-emerald-500/30 group-hover:bg-emerald-500 transition-all absolute bottom-0 inset-x-0"
              style={{ height: `${val}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
