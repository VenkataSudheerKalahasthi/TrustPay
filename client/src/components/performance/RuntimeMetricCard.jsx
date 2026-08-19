import { Activity } from 'lucide-react';

export function RuntimeMetricCard({ title, value, status = 'OPTIMAL' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold uppercase tracking-wider">{title}</span>
        <Activity className="w-4 h-4 text-sky-400 dark:text-primary-400" />
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{status}</span>
      </div>
    </div>
  );
}
