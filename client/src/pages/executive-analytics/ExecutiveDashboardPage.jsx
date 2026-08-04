import { useState, useEffect } from 'react';
import { executiveAnalyticsService } from '@services/executiveAnalytics.service';
import { ExecutiveDashboardCard } from '@components/executive-analytics/ExecutiveDashboardCard';
import { RevenueTrendChart } from '@components/executive-analytics/RevenueTrendChart';
import { MarketplaceAnalyticsChart } from '@components/executive-analytics/MarketplaceAnalyticsChart';
import { WorkforceAnalyticsChart } from '@components/executive-analytics/WorkforceAnalyticsChart';
import { SupportAnalyticsChart } from '@components/executive-analytics/SupportAnalyticsChart';
import { ComparisonChart } from '@components/executive-analytics/ComparisonChart';
import { AIReportSummaryCard } from '@components/executive-analytics/AIReportSummaryCard';
import { ExecutiveKPIWidget } from '@components/executive-analytics/ExecutiveKPIWidget';
import { ExecutiveAlertCard } from '@components/executive-analytics/ExecutiveAlertCard';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';

export function ExecutiveDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    executiveAnalyticsService
      .getOverview()
      .then((data) => setOverview(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-sky-400" />
          Executive Decision Intelligence Portal
        </h1>
        <p className="text-slate-400 text-sm">Real-time C-suite executive dashboard, cross-module analytics, and AI strategic insights</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ExecutiveDashboardCard title="Gross Escrow Volume" value="₹6,800,000" changePercent={51.1} icon={TrendingUp} color="emerald" />
        <ExecutiveDashboardCard title="Net Commission Margin" value="₹340,000" changePercent={51.1} icon={DollarSign} color="sky" />
        <ExecutiveDashboardCard title="Active Workforce" value="290 Workers" changePercent={31.8} icon={Users} color="purple" />
        <ExecutiveDashboardCard title="Marketplace Velocity" value="110 Executed" changePercent={30.9} icon={ShoppingBag} color="amber" />
      </div>

      {/* AI Advisory Summary */}
      <AIReportSummaryCard summary={overview?.aiInsight} />

      {/* Revenue & Marketplace Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart analytics={overview?.revenueAnalytics} />
        <MarketplaceAnalyticsChart analytics={overview?.marketplaceAnalytics} />
      </div>

      {/* Workforce & Support Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkforceAnalyticsChart analytics={overview?.workforceAnalytics} />
        <SupportAnalyticsChart analytics={overview?.supportAnalytics} />
      </div>

      {/* Comparative Analysis */}
      <ComparisonChart metrics={overview?.comparativeMetrics} />

      {/* Executive KPIs & Anomaly Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Executive KPI Benchmarks</h3>
          <div className="grid grid-cols-1 gap-3">
            {(overview?.kpiBenchmarks || []).map((kpi) => (
              <ExecutiveKPIWidget key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Executive Anomalies & Alerts</h3>
          <div className="grid grid-cols-1 gap-3">
            {(overview?.alerts || []).map((alt) => (
              <ExecutiveAlertCard key={alt.id} alert={alt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
