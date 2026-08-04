import { CheckCircle2, Clock } from 'lucide-react';

export function DiagnosticReportCard({ diagnostic }) {
  if (!diagnostic) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase">{diagnostic.component}</span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3" /> {diagnostic.status}
        </span>
      </div>

      <h4 className="text-sm font-bold text-white">{diagnostic.testName}</h4>
      <p className="text-xs text-slate-300">{diagnostic.details}</p>

      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
        <Clock className="w-3 h-3" /> Latency: {diagnostic.latencyMs}ms
      </div>
    </div>
  );
}
