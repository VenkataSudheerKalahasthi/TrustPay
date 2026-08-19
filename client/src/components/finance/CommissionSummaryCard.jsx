import { Percent, ShieldCheck } from 'lucide-react';

export function CommissionSummaryCard({ rule }) {
  if (!rule) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-sky-400 dark:text-primary-400 uppercase">{rule.code}</span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          <ShieldCheck className="w-3 h-3" /> Active Rule
        </span>
      </div>

      <h4 className="text-base font-bold text-white">{rule.name}</h4>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <Percent className="w-5 h-5 text-amber-400" />
        <span className="text-2xl font-black text-white font-mono">{rule.rate}%</span>
        <span className="text-xs text-slate-400">Platform Escrow Payout Fee</span>
      </div>
    </div>
  );
}
