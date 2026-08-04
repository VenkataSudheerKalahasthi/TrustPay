import { useState, useEffect, useCallback } from 'react';
import { Download, CheckCircle, Clock, Wallet, Award, RefreshCw } from 'lucide-react';
import { analyticsService } from '@services/analytics.service';
import { Button } from '@components/ui/Button';
import { KPICard } from '@components/analytics/KPICard';
import { DateRangePicker } from '@components/analytics/DateRangePicker';
import { AreaChartWidget } from '@components/analytics/AreaChartWidget';
import { BarChartWidget } from '@components/analytics/BarChartWidget';
import { RadarChartWidget } from '@components/analytics/RadarChartWidget';
import { ExportDialog } from '@components/analytics/ExportDialog';

export function WorkerAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('MONTHLY');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsService.getDashboard({ dateRange });
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load worker analytics');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExport = async (exportConfig) => {
    setExporting(true);
    try {
      const response = await analyticsService.exportReport({
        ...exportConfig,
        dateRange,
      });

      const blob = new Blob([response], {
        type: exportConfig.format === 'PDF' ? 'application/pdf' : 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Worker_Earnings_Report.${exportConfig.format.toLowerCase()}`;
      a.click();
      setExportModalOpen(false);
    } catch (err) {
      console.error('Export report failed', err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-16 bg-surface-900 border border-surface-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-900 border border-surface-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-surface-900 border border-red-500/30 text-center space-y-4">
        <p className="text-xs text-red-400">{error || 'Failed to load analytics'}</p>
        <Button size="sm" variant="secondary" onClick={fetchAnalytics} leftIcon={<RefreshCw size={14} />}>
          Retry
        </Button>
      </div>
    );
  }

  const metrics = data.metrics || {};
  const trends = data.trends || [];
  const radarMetrics = data.radarMetrics || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-50">Worker Performance & Earnings Dashboard</h1>
          <p className="text-xs text-surface-400">
            Escrow payout earnings, deliverable completion rates, and client evaluation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker selectedRange={dateRange} onChange={setDateRange} />
          <Button size="sm" onClick={() => setExportModalOpen(true)} leftIcon={<Download size={14} />}>
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Escrow Earnings"
          value={metrics.totalEarnings || 0}
          isCurrency
          change={18}
          icon={Wallet}
          color="emerald"
        />
        <KPICard
          title="Approved Deliverables"
          value={metrics.completedDeliverables || 0}
          change={10}
          icon={CheckCircle}
          color="primary"
        />
        <KPICard
          title="Pending Deliverables"
          value={metrics.pendingDeliverables || 0}
          change={-2}
          icon={Clock}
          color="amber"
        />
        <KPICard
          title="Active Projects"
          value={metrics.activeProjects || 0}
          change={5}
          icon={Award}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AreaChartWidget title="Monthly Earnings Trend" data={trends} dataKey="gmv" color="#10b981" />
        <BarChartWidget title="Completed Deliverables per Month" data={trends} dataKey="projects" color="#0ea5e9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RadarChartWidget title="Productivity & Compliance Ratings" data={radarMetrics} />
        </div>
      </div>

      <ExportDialog
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        isExporting={exporting}
      />
    </div>
  );
}
