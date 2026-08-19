import { useState, useEffect } from 'react';
import { Wallet, Sparkles, TrendingUp, DollarSign, PiggyBank } from 'lucide-react';
import { financeService } from '@services/finance.service';
import { FinancialKPIWidget } from '@components/finance/FinancialKPIWidget';
import { RevenueChart } from '@components/finance/RevenueChart';
import { ExpenseChart } from '@components/finance/ExpenseChart';

export function FinanceDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sum, ins] = await Promise.all([
        financeService.getDashboardSummary().catch(() => null),
        financeService.getAIInsights().catch(() => null),
      ]);
      setSummary(sum);
      setAiInsights(ins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 dark:from-[#0A120E] via-slate-900 dark:via-[#07100B] to-sky-950/40 dark:to-primary-950/20 border border-slate-800 dark:border-primary-900/30 rounded-2xl p-8 shadow-2xl">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 dark:text-primary-400">Enterprise Operations</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Finance, Billing & Revenue Operations</h1>
          <p className="text-slate-300 text-sm md:text-base mt-2">
            Centralized SaaS subscription management, corporate budgeting, revenue/expense ledgers, marketplace commissions, and AI financial advisory intelligence.
          </p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FinancialKPIWidget title="Monthly Recurring Revenue" value={`₹${(summary?.mrr || 150000).toLocaleString()}`} subtitle="MRR Velocity" icon={TrendingUp} color="emerald" />
        <FinancialKPIWidget title="Annual Run Rate" value={`₹${(summary?.arr || 1800000).toLocaleString()}`} subtitle="ARR Forecast" icon={DollarSign} color="sky" />
        <FinancialKPIWidget title="Total Revenue" value={`₹${(summary?.totalRevenue || 250000).toLocaleString()}`} subtitle="Gross Inflow" icon={Wallet} color="purple" />
        <FinancialKPIWidget title="Net Profit Margin" value={`₹${(summary?.netProfit || 138000).toLocaleString()}`} subtitle="Operating Margin" icon={PiggyBank} color="amber" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart mrr={summary?.mrr} arr={summary?.arr} />
        <ExpenseChart />
      </div>

      {/* AI Financial Advisory Insights */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-400 dark:text-primary-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Financial Advisory Insights</h3>
            <p className="text-xs text-slate-400">Automated margin optimization, cost trimming, and ARR forecast intelligence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights?.insights?.map((ins) => (
            <div key={ins.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-1">
              <h4 className="text-sm font-bold text-white">{ins.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{ins.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
