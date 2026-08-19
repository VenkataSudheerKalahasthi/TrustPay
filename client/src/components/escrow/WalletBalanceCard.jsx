import { Wallet, Lock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function WalletBalanceCard({ title, amount, type = 'available', currency = 'INR' }) {
  const getIcon = () => {
    switch (type) {
      case 'available':
        return <Wallet size={18} className="text-primary-400" />;
      case 'held':
        return <Lock size={18} className="text-warning-400" />;
      case 'released':
        return <ArrowUpRight size={18} className="text-success-400" />;
      case 'refunded':
        return <ArrowDownLeft size={18} className="text-primary-400" />;
      default:
        return <Wallet size={18} className="text-surface-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'available':
        return 'border-primary-500/20 bg-primary-500/5';
      case 'held':
        return 'border-warning-500/20 bg-warning-500/5';
      case 'released':
        return 'border-success-500/20 bg-success-500/5';
      default:
        return 'border-surface-700 bg-surface-800/40';
    }
  };

  return (
    <div className={`p-5 rounded-2xl border ${getBorderColor()} backdrop-blur-md flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-2xs font-bold text-surface-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-surface-800/60 border border-surface-700">
          {getIcon()}
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-surface-50 font-display">
          ₹{(amount || 0).toLocaleString('en-IN')}
        </div>
        <span className="text-2xs text-surface-400 font-mono">{currency}</span>
      </div>
    </div>
  );
}
