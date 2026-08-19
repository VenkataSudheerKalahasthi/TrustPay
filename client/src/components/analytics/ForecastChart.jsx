import { Sparkles } from 'lucide-react';

export function ForecastChart({ forecast }) {
  const results = forecast?.results || [
    { periodLabel: 'Month +1', projectedValue: 162000, lowerBound: 155000, upperBound: 170000 },
    { periodLabel: 'Month +2', projectedValue: 175000, lowerBound: 165000, upperBound: 185000 },
    { periodLabel: 'Quarter +1', projectedValue: 195000, lowerBound: 180000, upperBound: 210000 },
    { periodLabel: 'Quarter +2', projectedValue: 220000, lowerBound: 200000, upperBound: 240000 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400 dark:text-primary-400" />
            {forecast?.name || 'Predictive Revenue Velocity Forecast'}
          </h3>
          <p className="text-xs text-slate-400">95% Confidence Band Linear Regression</p>
        </div>

        <span className="text-xs font-mono font-bold bg-sky-500/10 text-sky-400 dark:text-primary-400 border border-sky-500/20 px-3 py-1 rounded-full">
          {forecast?.algorithm || 'LINEAR_REGRESSION'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
        {results.map((res, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs text-slate-400 font-mono">{res.periodLabel}</span>
            <h4 className="text-xl font-black text-white font-mono">₹{res.projectedValue.toLocaleString()}</h4>
            <div className="text-[10px] text-slate-400 font-mono">
              Band: ₹{res.lowerBound?.toLocaleString()} - ₹{res.upperBound?.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
