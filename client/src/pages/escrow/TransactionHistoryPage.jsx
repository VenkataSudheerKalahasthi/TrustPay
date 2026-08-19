import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { escrowService } from '@services/escrow.service';
import { TransactionBadge } from '@components/escrow/TransactionBadge';
import { PageLoader } from '@components/error/PageLoader';
import { ArrowLeft, Clock } from 'lucide-react';

export function TransactionHistoryPage() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await escrowService.searchTransactions({
        type: typeFilter || undefined,
        limit: 50,
      });
      setTransactions(res.transactions || []);
    } catch {
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-card border border-surface-200 text-surface-600 hover:text-surface-900"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 font-display">
              Immutable Financial Ledger
            </h1>
            <p className="text-xs text-surface-600">
              Complete append-only audit trail of deposits, holds, releases & refunds.
            </p>
          </div>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-card border border-surface-200 rounded-xl px-3 py-2 text-xs text-surface-800 focus:outline-none focus:border-primary-600"
        >
          <option value="">All Transaction Types</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="HOLD">Held in Escrow</option>
          <option value="RELEASE">Release</option>
          <option value="REFUND">Refund</option>
        </select>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : transactions.length === 0 ? (
        <div className="glass-card p-12 text-center text-xs text-surface-600">
          No financial transaction entries matching filter criteria.
        </div>
      ) : (
        <div className="glass-card p-6 space-y-3">
          {transactions.map((tx) => {
            const dateStr = tx.createdAt
              ? new Date(tx.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={tx.id}
                className="bg-card/60 p-4 rounded-xl border border-surface-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <TransactionBadge type={tx.type} />
                  <div>
                    <span className="text-xs font-bold text-surface-800 font-mono block">
                      {tx.referenceNumber}
                    </span>
                    <p className="text-xs text-surface-700 mt-0.5">{tx.description}</p>
                    <div className="flex items-center gap-1 text-2xs text-surface-500 font-mono mt-1">
                      <Clock size={11} />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right border-t md:border-t-0 border-surface-200 pt-2 md:pt-0">
                  <span className="text-sm font-bold font-mono text-surface-900 block">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-2xs text-surface-500 block font-mono">
                    Before: ₹{tx.balanceBefore.toLocaleString('en-IN')} ➔ After: ₹
                    {tx.balanceAfter.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

