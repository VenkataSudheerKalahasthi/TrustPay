import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { PlatformMetricCard } from '@components/admin/PlatformMetricCard';
import { Activity } from 'lucide-react';

export function PlatformMonitoringPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getPlatformMetrics()
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-sky-400" />
          Real-Time Platform Monitoring & System Metrics
        </h1>
        <p className="text-slate-400 text-sm">Monitor user growth, digital contracts, escrow volumes, AI token usage, and webhook status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlatformMetricCard metricKey="USER_ACCOUNTS" value={metrics?.usersMetric?.count || 0} status={metrics?.usersMetric?.status} />
        <PlatformMetricCard metricKey="DIGITAL_CONTRACTS" value={metrics?.contractsMetric?.count || 0} status={metrics?.contractsMetric?.status} />
        <PlatformMetricCard metricKey="ESCROW_VOLUME" value={`₹${(metrics?.escrowMetric?.volume || 0).toLocaleString()}`} status={metrics?.escrowMetric?.status} />
        <PlatformMetricCard metricKey="AI_TOKENS_CONSUMED" value={(metrics?.aiMetric?.totalTokens || 0).toLocaleString()} status={metrics?.aiMetric?.status} />
        <PlatformMetricCard metricKey="ACTIVE_WEBHOOKS" value={metrics?.systemMetric?.webhooks || 0} status={metrics?.systemMetric?.status} />
      </div>
    </div>
  );
}
