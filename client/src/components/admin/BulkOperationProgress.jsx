import { CheckCircle2, Clock } from 'lucide-react';

export function BulkOperationProgress({ operation }) {
  if (!operation) return null;

  const isCompleted = operation.status === 'COMPLETED';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase">{operation.operationType}</span>
        <span
          className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {operation.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 bg-slate-800/40 rounded-lg">
          <span className="text-slate-400 block">Total</span>
          <span className="font-bold text-white">{operation.targetCount}</span>
        </div>
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          <span className="block text-[10px]">Success</span>
          <span className="font-bold">{operation.successCount}</span>
        </div>
        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
          <span className="block text-[10px]">Failed</span>
          <span className="font-bold">{operation.failureCount}</span>
        </div>
      </div>
    </div>
  );
}
