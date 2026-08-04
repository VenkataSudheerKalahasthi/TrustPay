import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function KPICard({ title, value, change, isCurrency = false, icon: Icon, color = 'primary' }) {
  const isPositive = (change || 0) >= 0;

  const colorStyles = {
    primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }[color] || 'text-primary-400 bg-primary-500/10 border-primary-500/20';

  const formattedValue =
    typeof value === 'number'
      ? isCurrency
        ? `₹${value.toLocaleString()}`
        : value.toLocaleString()
      : value || '0';

  return (
    <Card className="p-5 bg-surface-900 border-surface-800 hover:border-surface-700 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-surface-400 truncate">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${colorStyles} shrink-0`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <h3 className="text-xl font-bold text-surface-50 tracking-tight">{formattedValue}</h3>

        {change !== undefined && change !== null && (
          <div
            className={`flex items-center gap-0.5 text-2xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            }`}
          >
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
}
