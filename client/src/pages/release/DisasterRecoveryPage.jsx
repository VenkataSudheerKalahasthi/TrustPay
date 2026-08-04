import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { DisasterRecoveryCard } from '@components/release/DisasterRecoveryCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function DisasterRecoveryPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Fetching disaster recovery failover logs..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Disaster Recovery & Database Failover Testing</h1>
        <p className="text-slate-400 text-xs">PostgreSQL primary failover simulations, RTO/RPO SLA verification, and data backup integrity</p>
      </div>

      <DisasterRecoveryCard tests={data?.drTests || []} />
    </div>
  );
}

export default DisasterRecoveryPage;
