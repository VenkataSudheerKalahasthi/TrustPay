import { useState, useEffect } from 'react';
import { releaseService } from '@services/release.service';
import { ProductionAcceptanceCard } from '@components/release/ProductionAcceptanceCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function ProductionAcceptancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    releaseService.getOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Auditing production sign-off reports..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Production Acceptance & TrustPay v2.0 Final Lock</h1>
        <p className="text-slate-400 text-xs">Operational handover sign-off, stakeholder approval verification, and official production lock</p>
      </div>

      <ProductionAcceptanceCard goLiveStatus={data?.goLiveStatus || {}} />
    </div>
  );
}

export default ProductionAcceptancePage;
