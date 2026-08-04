import { useState, useEffect } from 'react';
import { performanceService } from '@services/performance.service';
import { LoadTestSummary } from '@components/performance/LoadTestSummary';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function LoadTestingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Fetching stress test logs..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Load & Concurrency Stress Testing</h1>
        <p className="text-slate-400 text-xs">Simulated high-concurrency traffic, API throughput, and zero-error verification</p>
      </div>

      <LoadTestSummary results={data?.loadTestResults || []} />
    </div>
  );
}

export default LoadTestingPage;
