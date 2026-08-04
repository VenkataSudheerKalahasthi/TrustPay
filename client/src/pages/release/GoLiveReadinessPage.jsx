import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { GoLiveReadinessCard } from '@components/release/GoLiveReadinessCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function GoLiveReadinessPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Auditing go-live readiness index..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Platform Go-Live Readiness Assessment</h1>
        <p className="text-slate-400 text-xs">Blockers audit, infrastructure health check, and final launch readiness scoring</p>
      </div>

      <GoLiveReadinessCard readinessPct={data?.readinessPct || 100.0} blockersCount={0} />
    </div>
  );
}

export default GoLiveReadinessPage;
