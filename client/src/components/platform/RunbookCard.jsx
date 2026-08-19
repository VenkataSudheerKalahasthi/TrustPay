import { BookOpen } from 'lucide-react';

export function RunbookCard({ runbook }) {
  if (!runbook) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-sky-400 dark:text-primary-400 uppercase">{runbook.code}</span>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{runbook.category}</span>
      </div>

      <h4 className="text-base font-bold text-white flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-sky-400 dark:text-primary-400" />
        {runbook.title}
      </h4>

      <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-300 whitespace-pre-line border border-slate-800">
        {runbook.procedure}
      </div>
    </div>
  );
}
