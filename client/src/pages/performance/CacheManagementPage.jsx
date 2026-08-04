import { useState, useEffect } from 'react';
import { performanceService } from '@services/performance.service';
import { CacheStatisticsCard } from '@components/performance/CacheStatisticsCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function CacheManagementPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Retrieving cache hit statistics..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Redis & In-Memory Cache Management</h1>
        <p className="text-slate-400 text-xs">Cache invalidation, TTL configuration, and hybrid caching strategy enforcement</p>
      </div>

      <CacheStatisticsCard configs={data?.cacheConfigs || []} />
    </div>
  );
}

export default CacheManagementPage;
