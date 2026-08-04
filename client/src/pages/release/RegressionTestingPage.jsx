import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { RegressionSummaryCard } from '@components/release/RegressionSummaryCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function RegressionTestingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Fetching regression test suite results..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Full Platform Regression Testing</h1>
        <p className="text-slate-400 text-xs">Cross-module workflow verification, API contract validation, and zero-regression audit</p>
      </div>

      <RegressionSummaryCard suites={data?.regressionSuites || []} />
    </div>
  );
}

export default RegressionTestingPage;
