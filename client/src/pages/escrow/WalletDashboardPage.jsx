import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { escrowService } from '@services/escrow.service';
import { WalletBalanceCard } from '@components/escrow/WalletBalanceCard';
import { TransactionBadge } from '@components/escrow/TransactionBadge';
import { DepositModal } from '@components/escrow/DepositModal';
import { Button } from '@components/ui/Button';
import { PageLoader } from '@components/error/PageLoader';
import { CreditCard, History, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export function WalletDashboardPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const [wltRes, txRes] = await Promise.all([
        escrowService.getWallet(),
        escrowService.searchTransactions({ limit: 5 }),
      ]);
      setWallet(wltRes);
      setTransactions(txRes?.transactions || []);
    } catch {
      setWallet(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-surface-100 font-display">
              Escrow Wallet & Payments
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-success-500/10 text-success-400 text-2xs font-mono border border-success-500/20">
              {wallet?.status || 'ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-surface-400">
            Secure client escrow balances, Razorpay deposits & contractual releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/wallet/transactions">
            <Button variant="outline" size="sm" leftIcon={<History size={14} />}>
              Ledger History
            </Button>
          </Link>

          <Link to="/invoices">
            <Button variant="outline" size="sm" leftIcon={<FileText size={14} />}>
              Invoices
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={() => setIsDepositOpen(true)}
            leftIcon={<CreditCard size={14} />}
          >
            Deposit Funds
          </Button>
        </div>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WalletBalanceCard
          title="Available Balance"
          amount={wallet?.availableBalance}
          type="available"
        />
        <WalletBalanceCard
          title="Held in Escrow"
          amount={wallet?.heldBalance}
          type="held"
        />
        <WalletBalanceCard
          title="Total Released"
          amount={wallet?.releasedBalance}
          type="released"
        />
        <WalletBalanceCard
          title="Total Refunded"
          amount={wallet?.refundedBalance}
          type="refunded"
        />
      </div>

      {/* Security Banner */}
      <div className="glass-card p-4 flex items-center justify-between gap-4 border-l-4 border-l-primary-500">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-primary-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-surface-200">
              Double-Entry Immutable Escrow Protection
            </h4>
            <p className="text-2xs text-surface-400">
              Client deposits are held securely until contractual milestones are satisfied and signed.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-800/80 pb-3">
          <h3 className="text-sm font-bold text-surface-100 font-display">
            Recent Ledger Transactions
          </h3>
          <Link
            to="/wallet/transactions"
            className="text-xs text-primary-400 hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-surface-400">
            No financial transactions recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-surface-900/60 p-4 rounded-xl border border-surface-800/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <TransactionBadge type={tx.type} />
                  <div>
                    <span className="text-xs font-bold text-surface-200 block font-mono">
                      {tx.referenceNumber}
                    </span>
                    <span className="text-2xs text-surface-400">{tx.description}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold font-mono ${
                      tx.type === 'DEPOSIT' || tx.type === 'REFUND'
                        ? 'text-success-400'
                        : 'text-surface-200'
                    }`}
                  >
                    {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '+' : '-'}₹
                    {tx.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-2xs text-surface-500 block">
                    Bal: ₹{tx.balanceAfter.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSuccess={fetchWalletData}
      />
    </div>
  );
}
