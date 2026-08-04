import { AlertTriangle, CheckCircle } from 'lucide-react';

export function CapacityGauge({ plan }) {
  if (!plan) return null;

  const target = plan.targetCapacityHours || 1;
  const allocated = plan.totalAllocatedHours || 0;
  const utilizationPct = Math.round((allocated / target) * 100);
  const isOverallocated = allocated > target;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-white">{plan.name}</h4>
          <p className="text-xs text-slate-400">Target: {target}h | Allocated: {allocated}h</p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isOverallocated
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : utilizationPct >= 100
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {isOverallocated ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overloaded ({utilizationPct}%)</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{utilizationPct}% Utilized</span>
            </>
          )}
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOverallocated ? 'bg-rose-500' : utilizationPct >= 85 ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${Math.min(100, utilizationPct)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
        <span>0h</span>
        <span className="font-medium text-slate-200">{Math.max(0, target - allocated)}h available</span>
        <span>{target}h Target</span>
      </div>
    </div>
  );
}
