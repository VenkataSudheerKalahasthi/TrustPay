import { useState, useEffect } from 'react';
import { performanceService } from '@services/performance.service';
import { ReleaseCandidateCard } from '@components/performance/ReleaseCandidateCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function ReleaseCandidatePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Auditing release candidate checklist..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Release Candidate Production Hardening</h1>
        <p className="text-slate-400 text-xs">Production acceptance verification, deployment approval, and final release scoring</p>
      </div>

      <ReleaseCandidateCard status={data?.releaseCandidate || {}} />
    </div>
  );
}

export default ReleaseCandidatePage;
