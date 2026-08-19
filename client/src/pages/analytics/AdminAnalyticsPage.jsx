import { useState, useEffect, useCallback } from 'react';
import { Download, Users, FolderOpen, FileText, Wallet, ShieldCheck, Activity, RefreshCw } from 'lucide-react';
import { analyticsService } from '@services/analytics.service';
import { Button } from '@components/ui/Button';
import { KPICard } from '@components/analytics/KPICard';
import { DateRangePicker } from '@components/analytics/DateRangePicker';
import { LineChartWidget } from '@components/analytics/LineChartWidget';
import { AreaChartWidget } from '@components/analytics/AreaChartWidget';
import { PieChartWidget } from '@components/analytics/PieChartWidget';
import { ExportDialog } from '@components/analytics/ExportDialog';

export function AdminAnalyticsPage() {
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
      setError(err.response?.data?.message || 'Failed to load admin platform analytics');
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
      a.download = `Platform_Operations_Report.${exportConfig.format.toLowerCase()}`;
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
        <div className="h-16 bg-card border border-surface-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-card border border-surface-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-card border border-red-500/30 text-center space-y-4">
        <p className="text-xs text-red-400">{error || 'Failed to load analytics'}</p>
        <Button size="sm" variant="secondary" onClick={fetchAnalytics} leftIcon={<RefreshCw size={14} />}>
          Retry
        </Button>
      </div>
    );
  }

  const metrics = data.metrics || {};
  const trends = data.trends || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900">System Operations & GMV Analytics</h1>
          <p className="text-xs text-surface-600">
            Platform volume, total escrow flow, revenue models, user growth, and active system metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker selectedRange={dateRange} onChange={setDateRange} />
          <Button size="sm" onClick={() => setExportModalOpen(true)} leftIcon={<Download size={14} />}>
            Export Executive Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Platform GMV Volume"
          value={metrics.platformGMV || 0}
          isCurrency
          change={24}
          icon={Wallet}
          color="emerald"
        />
        <KPICard
          title="Estimated Platform Revenue"
          value={metrics.platformRevenue || 0}
          isCurrency
          change={18}
          icon={Activity}
          color="primary"
        />
        <KPICard
          title="Total Platform Users"
          value={metrics.totalUsers || 0}
          change={12}
          icon={Users}
          color="indigo"
        />
        <KPICard
          title="Active Online Users"
          value={metrics.onlineUsersCount || 0}
          change={30}
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineChartWidget title="Platform GMV Growth Trend" data={trends} dataKey="gmv" color="#10b981" />
        <AreaChartWidget title="Net Platform Revenue Flow" data={trends} dataKey="revenue" color="#0ea5e9" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Total Projects"
          value={metrics.totalProjects || 0}
          icon={FolderOpen}
          color="primary"
        />
        <KPICard
          title="Active Contracts"
          value={metrics.activeContracts || 0}
          icon={FileText}
          color="indigo"
        />
        <PieChartWidget title="Platform Usage Breakdown" />
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

