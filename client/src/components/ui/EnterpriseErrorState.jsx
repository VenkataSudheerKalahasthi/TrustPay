import { AlertTriangle } from 'lucide-react';

export function EnterpriseErrorState({ title = 'Something went wrong', description = 'An unexpected error occurred while loading this section.', onRetry }) {
  return (
    <div className="py-12 px-4 text-center border border-rose-500/20 rounded-2xl bg-rose-500/5 space-y-3">
      <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-600/20"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
