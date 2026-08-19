import { DollarSign } from 'lucide-react';

export function FinanceAnalyticsChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        Financial Operations & Treasury Liquidity
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Total Escrow Reserves</p>
          <p className="text-xl font-bold text-emerald-400">₹8,450,000</p>
          <p className="text-xs text-slate-500">100% Liquidity Backed</p>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Net Platform Margin</p>
          <p className="text-xl font-bold text-white">12.4%</p>
          <p className="text-xs text-emerald-400">+1.8% vs last month</p>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Active Subscriptions</p>
          <p className="text-xl font-bold text-sky-400 dark:text-primary-400">42 Enterprise</p>
          <p className="text-xs text-slate-500">Annual recurring billing</p>
        </div>
      </div>
    </div>
  );
}
