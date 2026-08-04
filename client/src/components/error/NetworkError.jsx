import { WifiOff, RotateCcw } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function NetworkError({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-warning-500/30 bg-warning-500/10 max-w-md mx-auto my-8">
      <div className="p-3.5 rounded-2xl bg-warning-500/20 text-warning-400 border border-warning-500/30 mb-4">
        <WifiOff size={32} />
      </div>
      <h3 className="text-lg font-bold text-surface-100 font-display">Network Connection Lost</h3>
      <p className="text-xs text-surface-300 mt-1 max-w-xs leading-relaxed">
        Unable to connect to the TrustPay server. Please check your internet connection and try again.
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 border-warning-500/50 text-warning-300 hover:bg-warning-500/20"
          leftIcon={<RotateCcw size={14} />}
          onClick={onRetry}
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
}
