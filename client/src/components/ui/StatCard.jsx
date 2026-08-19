import { Card } from './Card';
import { cn } from '@utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
  variant = 'default',
  className,
}) {
  const isPositive = trend === 'up';

  return (
    <Card variant={variant} className={cn('relative overflow-hidden glass-card', className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl font-bold font-display text-surface-50">
            {value}
          </span>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 shrink-0">
            <Icon size={20} />
          </div>
        )}
      </div>

      {(trendValue || description) && (
        <div className="mt-4 pt-3 border-t border-surface-800 flex items-center justify-between text-xs">
          {trendValue && (
            <div
              className={cn(
                'flex items-center gap-1 font-semibold',
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{trendValue}</span>
            </div>
          )}
          {description && <span className="text-surface-400">{description}</span>}
        </div>
      )}
    </Card>
  );
}
