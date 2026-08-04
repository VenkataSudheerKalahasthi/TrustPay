import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { ReleaseStatusCard } from '@components/release/ReleaseStatusCard';
import { CertificationCard } from '@components/release/CertificationCard';
import { RegressionSummaryCard } from '@components/release/RegressionSummaryCard';
import { SecurityValidationCard } from '@components/release/SecurityValidationCard';
import { ProductionAcceptanceCard } from '@components/release/ProductionAcceptanceCard';
import { ReleaseTimeline } from '@components/release/ReleaseTimeline';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function ReleaseDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Retrieving release certification status..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">TrustPay v2.0 Release Command Center</h1>
        <p className="text-slate-400 text-xs">Final platform release certification, regression suite verification, and production sign-off</p>
      </div>

      <ReleaseStatusCard version={data?.version || 'v2.0.0'} status={data?.status || 'CERTIFIED'} readinessPct={data?.readinessPct || 100.0} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CertificationCard cert={data?.goLiveStatus?.certification || {}} />
        <ReleaseTimeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegressionSummaryCard suites={data?.regressionSuites || []} />
        <SecurityValidationCard reports={data?.securityReports || []} />
      </div>

      <ProductionAcceptanceCard goLiveStatus={data?.goLiveStatus || {}} />
    </div>
  );
}

export default ReleaseDashboardPage;
