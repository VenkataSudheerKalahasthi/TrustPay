import { Activity } from 'lucide-react';

export function PlatformMetricCard({ metricKey, value, status }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase">{metricKey}</span>
        <div className="text-xl font-bold text-white font-mono">{value}</div>
      </div>

      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono uppercase">
        <Activity className="w-3 h-3" /> {status || 'OPTIMAL'}
      </span>
    </div>
  );
}
