import { useState, useEffect } from 'react';
import { analyticsService } from '@services/analytics.service';
import { ExecutiveSummaryCard } from '@components/analytics/ExecutiveSummaryCard';
import { ExecutiveDashboard } from '@components/analytics/ExecutiveDashboard';
import { ForecastChart } from '@components/analytics/ForecastChart';
import { BusinessInsightCard } from '@components/analytics/BusinessInsightCard';
import { DashboardCustomizer } from '@components/analytics/DashboardCustomizer';

export function ExecutiveDashboardPage() {
  const [dashboards, setDashboards] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [d, k, i] = await Promise.all([
        analyticsService.getExecutiveDashboards().catch(() => []),
        analyticsService.getKPIs().catch(() => []),
        analyticsService.getDecisionInsights().catch(() => null),
      ]);
      setDashboards(d);
      setKpis(k);
      setInsightsData(i);
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
      {/* Executive Summary */}
      <ExecutiveSummaryCard summary={insightsData?.summary} />

      {/* Main Executive Dashboard Grid */}
      <ExecutiveDashboard
        dashboard={dashboards[0] || { title: 'C-Suite Executive Intelligence Portal', visibility: 'ORGANIZATION' }}
        kpis={kpis}
        onCustomize={() => setIsCustomizing(true)}
      />

      {/* Predictive Forecast & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastChart />
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">AI Decision Insights</h3>
          {insightsData?.insights?.slice(0, 2).map((ins) => (
            <BusinessInsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      </div>

      <DashboardCustomizer
        isOpen={isCustomizing}
        onClose={() => setIsCustomizing(false)}
        onSave={fetchDashboardData}
      />
    </div>
  );
}
