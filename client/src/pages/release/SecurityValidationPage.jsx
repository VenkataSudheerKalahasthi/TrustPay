import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { SecurityValidationCard } from '@components/release/SecurityValidationCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function SecurityValidationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Auditing security scan reports..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Security Validation & Secret Exposure Scan</h1>
        <p className="text-slate-400 text-xs">RBAC permissions matrix verification, OWASP API vulnerability audit, and zero-leak confirmation</p>
      </div>

      <SecurityValidationCard reports={data?.securityReports || []} />
    </div>
  );
}

export default SecurityValidationPage;
