import { Activity } from 'lucide-react';

export function BusinessMetricCard({ label, value, unit = 'INR', change = '+12.5%' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-semibold">{label}</span>
        <Activity className="w-4 h-4 text-sky-400 dark:text-primary-400" />
      </div>

      <div className="flex items-baseline justify-between">
        <h4 className="text-2xl font-black text-white font-mono">{value} <span className="text-xs text-slate-400">{unit}</span></h4>
        <span className="text-xs font-bold text-emerald-400 font-mono">{change}</span>
      </div>
    </div>
  );
}
