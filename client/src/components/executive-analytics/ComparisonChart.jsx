import { GitCompare } from 'lucide-react';

export function ComparisonChart({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <GitCompare className="w-5 h-5 text-sky-400 dark:text-primary-400" />
        Comparative Period Analysis
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const isPos = m.changePercent >= 0;
          return (
            <div key={m.metricKey} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-1">
              <p className="text-xs text-slate-400 font-semibold uppercase">{m.metricKey.replace('_', ' ')}</p>
              <p className="text-xl font-bold text-white">{m.currentValue.toLocaleString()}</p>
              <p className={`text-xs font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? '↑ +' : '↓ '}{m.changePercent}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
