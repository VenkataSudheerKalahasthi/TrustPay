import { useState, useEffect } from 'react';
import { performanceService } from '@services/performance.service';
import { SlowQueryTable } from '@components/performance/SlowQueryTable';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function DatabaseOptimizationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Profiling database queries..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Prisma Query Profiler & Index Advisor</h1>
        <p className="text-slate-400 text-xs">Elimination of N+1 queries, composite indexing, and cursor pagination optimization</p>
      </div>

      <SlowQueryTable queries={data?.slowQueries || []} />
    </div>
  );
}

export default DatabaseOptimizationPage;
