import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

export function GoalProgressCard({ goal }) {
  if (!goal) return null;

  const current = goal.currentValue || 0;
  const target = goal.targetValue || 1;
  const pct = Math.min(100, Math.round((current / target) * 100));

  const isCompleted = goal.status === 'COMPLETED';
  const isAtRisk = goal.status === 'AT_RISK';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-slate-400 font-semibold">Target Date: {new Date(goal.targetDate).toLocaleDateString()}</span>
          <h4 className="text-base font-bold text-white mt-0.5">{goal.title}</h4>
        </div>

        <span
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isCompleted
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : isAtRisk
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : isAtRisk ? <AlertTriangle className="w-3 h-3" /> : <Target className="w-3 h-3" />}
          {goal.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400">Current: {current.toLocaleString()} {goal.unit}</span>
          <span className="text-white font-bold">Target: {target.toLocaleString()} {goal.unit}</span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted ? 'bg-emerald-500' : isAtRisk ? 'bg-rose-500' : 'bg-sky-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="text-right text-[11px] font-mono text-slate-400">
          Progress: {pct}%
        </div>
      </div>
    </div>
  );
}
