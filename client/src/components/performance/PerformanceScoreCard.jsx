export function PerformanceScoreCard({ category, score, status = 'EXCELLENT' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold uppercase tracking-wider">{category}</span>
        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{status}</span>
      </div>
      <h3 className="text-3xl font-extrabold text-white">{score} <span className="text-sm font-normal text-slate-500">/ 100</span></h3>
    </div>
  );
}
