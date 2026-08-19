import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function KPIWidget({ kpi }) {
  if (!kpi) return null;

  const isUp = kpi.trend === 'UP';
  const isDown = kpi.trend === 'DOWN';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-semibold uppercase">{kpi.category}</span>
        <span
          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isUp
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : isDown
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {kpi.trend}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{kpi.name}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black text-white font-mono">
            {typeof kpi.currentValue === 'number' ? kpi.currentValue.toLocaleString() : kpi.currentValue}
          </span>
          <span className="text-xs text-slate-400">{kpi.unit}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
        <span>Target: {kpi.targetValue?.toLocaleString()} {kpi.unit}</span>
        <span className="font-mono text-sky-400 dark:text-primary-400 font-bold">
          {kpi.targetValue > 0 ? Math.round((kpi.currentValue / kpi.targetValue) * 100) : 100}%
        </span>
      </div>
    </div>
  );
}
