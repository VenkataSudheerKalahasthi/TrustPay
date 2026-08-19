import { useState, useEffect } from 'react';
import { ApprovalQueueCard } from '@components/admin/ApprovalQueueCard';
import { CheckSquare } from 'lucide-react';

export function ApprovalCenterPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demonstrates administrative approval queue
    setApprovals([
      { id: 'app_1', entityType: 'ORGANIZATION', action: 'ENTERPRISE_TIER_UPGRADE', status: 'PENDING', reason: 'Organization requesting annual Enterprise billing profile' },
      { id: 'app_2', entityType: 'WALLET', action: 'LARGE_WITHDRAWAL_RELEASE', status: 'PENDING', reason: 'High-value transaction security verification check' },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Administrative Approval & Task Queue
        </h1>
        <p className="text-slate-400 text-sm">Enterprise tier requests, high-value wallet withdrawals, and administrative approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {approvals.map((app) => (
          <ApprovalQueueCard key={app.id} approval={app} />
        ))}
      </div>
    </div>
  );
}
