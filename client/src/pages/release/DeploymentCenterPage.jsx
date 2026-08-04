import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { DeploymentChecklistCard } from '@components/release/DeploymentChecklistCard';
import { RollbackPlanCard } from '@components/release/RollbackPlanCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function DeploymentCenterPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Auditing production deployment checklist..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Production Deployment & Rollback Center</h1>
        <p className="text-slate-400 text-xs">Zero-downtime deployment verification, green/blue traffic shifting, and environment validation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeploymentChecklistCard items={data?.deploymentChecklist || []} />
        <RollbackPlanCard />
      </div>
    </div>
  );
}

export default DeploymentCenterPage;
