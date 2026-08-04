import { Bot, Sparkles, CheckCircle2 } from 'lucide-react';

export function AIReportSummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              AI Executive Insight & Advisory Summary
              <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400" />
            </h3>
            <p className="text-xs text-slate-400">Advisory recommendations based on real-time telemetry</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          AI Advisory Only
        </span>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
        {summary.summaryText}
      </p>

      {summary.insights && summary.insights.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Strategic Findings</p>
          <div className="grid grid-cols-1 gap-2">
            {summary.insights.map((ins, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
