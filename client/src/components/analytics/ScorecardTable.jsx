import { Award } from 'lucide-react';

export function ScorecardTable({ scorecard }) {
  if (!scorecard) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold text-sky-400 uppercase">{scorecard.department}</span>
          <h3 className="text-xl font-bold text-white mt-0.5">{scorecard.title}</h3>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-bold text-sm">
          <Award className="w-4 h-4" />
          Overall Index: {scorecard.overallScore}%
        </div>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
          <tr>
            <th className="py-3 px-4">Metric</th>
            <th className="py-3 px-4 font-mono">Target</th>
            <th className="py-3 px-4 font-mono">Actual</th>
            <th className="py-3 px-4 font-mono text-right">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {scorecard.metrics?.map((m) => (
            <tr key={m.id} className="hover:bg-slate-800/30">
              <td className="py-3 px-4 font-medium text-white">{m.metricName}</td>
              <td className="py-3 px-4 font-mono text-slate-400">{m.target}</td>
              <td className="py-3 px-4 font-mono font-bold text-sky-400">{m.actual}</td>
              <td className="py-3 px-4 font-mono font-bold text-right text-emerald-400">{m.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
