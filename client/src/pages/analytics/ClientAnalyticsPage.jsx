import { useState, useEffect, useCallback } from 'react';
import { Download, FolderOpen, FileText, Wallet, CreditCard, RefreshCw } from 'lucide-react';
import { analyticsService } from '@services/analytics.service';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { KPICard } from '@components/analytics/KPICard';
import { DateRangePicker } from '@components/analytics/DateRangePicker';
import { LineChartWidget } from '@components/analytics/LineChartWidget';
import { AreaChartWidget } from '@components/analytics/AreaChartWidget';
import { PieChartWidget } from '@components/analytics/PieChartWidget';
import { ExportDialog } from '@components/analytics/ExportDialog';

export function ClientAnalyticsPage() {
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
      setError(err.response?.data?.message || 'Failed to load client analytics data');
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

      // Handle download trigger
      const blob = new Blob([response], {
        type: exportConfig.format === 'PDF' ? 'application/pdf' : 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Client_Analytics_Report.${exportConfig.format.toLowerCase()}`;
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
          <h1 className="text-xl font-bold text-surface-900">Client Analytics & Financial Dashboard</h1>
          <p className="text-xs text-surface-600">
            Realtime project execution progress, escrow wallet balances, and contract activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker selectedRange={dateRange} onChange={setDateRange} />
          <Button size="sm" onClick={() => setExportModalOpen(true)} leftIcon={<Download size={14} />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Projects"
          value={metrics.totalProjects || 0}
          change={12}
          icon={FolderOpen}
          color="primary"
        />
        <KPICard
          title="Active Contracts"
          value={metrics.activeContracts || 0}
          change={8}
          icon={FileText}
          color="indigo"
        />
        <KPICard
          title="Escrow Wallet Balance"
          value={metrics.totalEscrowBalance || 0}
          isCurrency
          change={15}
          icon={Wallet}
          color="emerald"
        />
        <KPICard
          title="Completed Projects"
          value={metrics.completedProjects || 0}
          change={5}
          icon={CreditCard}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineChartWidget title="Monthly Escrow Deposit GMV" data={trends} dataKey="gmv" color="#0ea5e9" />
        <AreaChartWidget title="Released Escrow Payments" data={trends} dataKey="revenue" color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="p-5 bg-card border-surface-200 space-y-4">
            <h3 className="text-sm font-bold text-surface-900">Recent Invoice Timeline</h3>
            {metrics.recentInvoices && metrics.recentInvoices.length > 0 ? (
              <div className="divide-y divide-surface-800">
                {metrics.recentInvoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-surface-900 block">{inv.invoiceNumber}</span>
                      <span className="text-2xs text-surface-600">
                        Created: {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-surface-800 block">
                        ₹{Number(inv.totalAmount || 0).toLocaleString()}
                      </span>
                      <span className="text-3xs text-emerald-400 uppercase font-semibold">{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-500">No recent invoice records found.</p>
            )}
          </Card>
        </div>

        <div>
          <PieChartWidget title="Project Status Distribution" />
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

