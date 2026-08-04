import { Clock } from 'lucide-react';

export function ApprovalQueueCard({ approval }) {
  if (!approval) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase">{approval.entityType}</span>
        <h4 className="text-sm font-bold text-white">{approval.action}</h4>
        {approval.reason && <p className="text-xs text-slate-400">{approval.reason}</p>}
      </div>

      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
        <Clock className="w-3 h-3" /> {approval.status || 'PENDING'}
      </span>
    </div>
  );
}
