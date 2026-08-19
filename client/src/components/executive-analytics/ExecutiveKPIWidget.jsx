import { Target } from 'lucide-react';

export function ExecutiveKPIWidget({ kpi }) {
  if (!kpi) return null;

  const isAbove = kpi.status === 'ABOVE_TARGET';
  const statusColor = isAbove
    ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
    : 'text-amber-400 border-amber-500/20 bg-amber-500/10';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.kpiCode}</span>
        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${statusColor}`}>
          {kpi.status.replace('_', ' ')}
        </span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-200">{kpi.name}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-white">
            {kpi.targetValue} {kpi.unit}
          </span>
          <span className="text-xs text-slate-400">Target Benchmark</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <Target className="w-3.5 h-3.5 text-sky-400 dark:text-primary-400" />
        <span>Warning Threshold: {kpi.warningValue} {kpi.unit}</span>
      </div>
    </div>
  );
}
