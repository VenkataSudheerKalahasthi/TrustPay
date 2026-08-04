import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { ComplianceCard } from '@components/release/ComplianceCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function ComplianceCenterPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Auditing regulatory compliance standards..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Regulatory & Legal Compliance Center</h1>
        <p className="text-slate-400 text-xs">ISO 27001, GDPR data privacy, and SOC 2 Type II enterprise compliance checklists</p>
      </div>

      <ComplianceCard compliance={data?.compliance || []} />
    </div>
  );
}

export default ComplianceCenterPage;
