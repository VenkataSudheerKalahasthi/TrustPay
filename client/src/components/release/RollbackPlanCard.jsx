import { RotateCcw } from 'lucide-react';

export function RollbackPlanCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-400" /> Zero-Downtime Rollback Strategy
        </h3>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Dry-Run Verified</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Automated database schema rollback and green/blue traffic shifting capable of restoring preceding state within 30 seconds.
      </p>
    </div>
  );
}
