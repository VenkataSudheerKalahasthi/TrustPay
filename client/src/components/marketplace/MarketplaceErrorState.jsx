import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function MarketplaceErrorState({ title = 'Failed to load opportunity data', onRetry }) {
  return (
    <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
      <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 w-12 h-12 mx-auto flex items-center justify-center">
        <AlertTriangle size={24} />
      </div>
      <h4 className="text-xs font-bold text-red-200">{title}</h4>
      <p className="text-3xs text-surface-400">Please check your connection or click retry to reload.</p>
      {onRetry && (
        <Button size="xs" variant="outline" onClick={onRetry} leftIcon={<RefreshCw size={12} />}>
          Retry Request
        </Button>
      )}
    </div>
  );
}
