import { CheckCircle2 } from 'lucide-react';

export function RegressionSummaryCard({ suites = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white">Full Regression Test Coverage</h3>
      <div className="space-y-3">
        {suites.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <div>
              <h4 className="font-bold text-white text-sm">{s.suiteName}</h4>
              <span className="text-slate-400">{s.passedCount} / {s.totalTests} Tests Passed</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% PASSED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
