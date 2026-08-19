import { ShieldCheck, Check, X } from 'lucide-react';

export function VerificationReviewCard({ review, onApprove, onReject }) {
  if (!review) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400 dark:text-primary-400" />
          <h4 className="text-sm font-bold text-white">
            {review.targetUser?.firstName} {review.targetUser?.lastName}
          </h4>
        </div>
        <p className="text-xs text-slate-400 font-mono">{review.targetUser?.email} ({review.targetUser?.role})</p>
        {review.notes && <p className="text-xs text-slate-300 italic">{review.notes}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onApprove && onApprove(review.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
        >
          <Check className="w-3.5 h-3.5" /> Approve
        </button>
        <button
          onClick={() => onReject && onReject(review.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    </div>
  );
}
