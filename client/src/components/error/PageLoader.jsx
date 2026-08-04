import { LoadingSpinner } from '@components/ui/LoadingSpinner';

export function PageLoader({ message = 'Loading TrustPay Portal...' }) {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-sm font-medium text-surface-400">{message}</p>
    </div>
  );
}
