import { AlertOctagon, CheckCircle2 } from 'lucide-react';

export function DisputeTimeline({ dispute }) {
  if (!dispute) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-slate-400 font-semibold">{dispute.disputeNumber}</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            Dispute Resolution Case
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            dispute.status === 'RESOLVED'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          {dispute.status}
        </span>
      </div>

      <div className="space-y-3 text-sm text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">Disputed Amount:</span>
          <span className="font-bold text-white font-mono">₹{dispute.amountDisputed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Raised By:</span>
          <span className="text-white font-medium">{dispute.raiserUser?.firstName} {dispute.raiserUser?.lastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Reason:</span>
          <span className="text-slate-200">{dispute.reason}</span>
        </div>
      </div>

      {dispute.resolutions?.length > 0 && (
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Settlement & Resolution Terms
          </h4>
          {dispute.resolutions.map((res) => (
            <div key={res.id} className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Refund Client: ₹{res.refundAmount}</span>
                <span className="text-emerald-400 font-bold">Release Worker: ₹{res.releaseAmount}</span>
              </div>
              <p className="text-slate-300 italic pt-1">{res.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
