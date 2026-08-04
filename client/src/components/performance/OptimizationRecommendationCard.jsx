import { CheckCircle2 } from 'lucide-react';

export function OptimizationRecommendationCard({ recommendations = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white">Applied Performance Optimizations</h3>
      <div className="space-y-3">
        {recommendations.map((r, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{r.title}</h4>
              <p className="text-xs text-slate-400">{r.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
