import { Sparkles, AlertOctagon } from 'lucide-react';

export function BusinessInsightCard({ insight }) {
  if (!insight) return null;

  const isCritical = insight.priority === 'CRITICAL' || insight.priority === 'HIGH';

  return (
    <div
      className={`bg-slate-900 border rounded-xl p-5 shadow-xl space-y-3 ${
        isCritical ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase">{insight.category}</span>
        <span
          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
            isCritical
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
          }`}
        >
          {isCritical ? <AlertOctagon className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {insight.priority} PRIORITY
        </span>
      </div>

      <h4 className="text-base font-bold text-white">{insight.title}</h4>

      <div className="space-y-2 text-xs text-slate-300">
        <div>
          <span className="font-semibold text-slate-400 block">Observation:</span>
          <p>{insight.observation}</p>
        </div>
        <div className="pt-2 border-t border-slate-800">
          <span className="font-semibold text-sky-400 block">Recommendation:</span>
          <p className="text-slate-200">{insight.suggestion}</p>
        </div>
      </div>
    </div>
  );
}
