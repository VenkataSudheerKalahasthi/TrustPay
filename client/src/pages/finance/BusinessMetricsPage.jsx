import { useState, useEffect } from 'react';
import { financeService } from '@services/finance.service';
import { BusinessMetricCard } from '@components/finance/BusinessMetricCard';
import { Activity } from 'lucide-react';

export function BusinessMetricsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    financeService
      .getDashboardSummary()
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-sky-400" />
          SaaS & Enterprise Business Performance Metrics
        </h1>
        <p className="text-slate-400 text-sm">Key SaaS metrics: Customer Acquisition Cost (CAC), Lifetime Value (LTV), Churn Rate, and ARPU</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BusinessMetricCard label="Monthly Recurring Revenue (MRR)" value="₹1,50,000" change="+14.2%" />
        <BusinessMetricCard label="Annual Run Rate (ARR)" value="₹18,00,000" change="+18.5%" />
        <BusinessMetricCard label="Customer Acquisition Cost (CAC)" value="₹4,200" change="-5.1%" />
        <BusinessMetricCard label="Customer Lifetime Value (LTV)" value="₹65,000" change="+22.0%" />
        <BusinessMetricCard label="Logo Churn Rate" value="1.2%" unit="%" change="-0.4%" />
        <BusinessMetricCard label="Average Revenue Per User (ARPU)" value="₹14,999" change="+8.3%" />
        <BusinessMetricCard label="Gross Margin" value="78.5%" unit="%" change="+2.1%" />
        <BusinessMetricCard label="Net Revenue Retention (NRR)" value="112%" unit="%" change="+4.0%" />
      </div>
    </div>
  );
}
