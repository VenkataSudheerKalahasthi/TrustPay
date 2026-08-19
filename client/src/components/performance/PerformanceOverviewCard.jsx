import { Gauge } from 'lucide-react';

export function PerformanceOverviewCard({ score = 98.5 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs text-sky-400 dark:text-primary-400 font-bold uppercase tracking-wider">Enterprise Performance Score</span>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">{score} <span className="text-sm font-normal text-slate-500">/ 100</span></h2>
        <p className="text-xs text-slate-400">All 15 modules operating at peak SLA targets</p>
      </div>
      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 dark:text-primary-400">
        <Gauge className="w-8 h-8" />
      </div>
    </div>
  );
}
