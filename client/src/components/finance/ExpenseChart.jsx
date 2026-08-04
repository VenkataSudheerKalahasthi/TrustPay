import { PieChart } from 'lucide-react';

export function ExpenseChart() {
  const categories = [
    { name: 'Cloud Infrastructure', amount: 45000, pct: 40, color: 'bg-sky-500' },
    { name: 'Escrow Payout Settlement', amount: 35000, pct: 30, color: 'bg-emerald-500' },
    { name: 'Customer Support & Operations', amount: 20000, pct: 18, color: 'bg-purple-500' },
    { name: 'Marketing & Talent Acquisition', amount: 12000, pct: 12, color: 'bg-amber-400' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Operating Expense Breakdown
          </h3>
          <p className="text-xs text-slate-400">Category-wise monthly expenditures</p>
        </div>

        <span className="text-xl font-black text-white font-mono">₹1,12,000</span>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-800">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">{cat.name}</span>
              <span className="text-white font-mono font-bold">₹{cat.amount.toLocaleString()} ({cat.pct}%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
