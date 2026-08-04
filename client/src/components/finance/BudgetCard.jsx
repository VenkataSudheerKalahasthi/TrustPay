import { AlertTriangle } from 'lucide-react';

export function BudgetCard({ budget }) {
  if (!budget) return null;

  const total = budget.totalBudget || 1;
  const spent = budget.spentAmount || 0;
  const pct = Math.min(100, Math.round((spent / total) * 100));
  const isOver = spent > total;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-slate-400 font-semibold">{budget.budgetNumber}</span>
          <h4 className="text-base font-bold text-white mt-0.5">{budget.title}</h4>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isOver
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          FY{budget.fiscalYear || 2026}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400">Spent: ₹{spent.toLocaleString()}</span>
          <span className="text-white font-bold">Total: ₹{total.toLocaleString()}</span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-400' : 'bg-emerald-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Utilization: {pct}%</span>
          {isOver && (
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <AlertTriangle className="w-3 h-3" /> Over Budget
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
