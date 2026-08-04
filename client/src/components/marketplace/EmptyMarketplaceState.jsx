import { Briefcase } from 'lucide-react';

export function EmptyMarketplaceState({ message = 'No job opportunities match your criteria.', actionText, onAction }) {
  return (
    <div className="p-8 rounded-2xl bg-surface-900 border border-surface-800 text-center space-y-3">
      <div className="p-3 rounded-2xl bg-surface-800 text-surface-400 w-12 h-12 mx-auto flex items-center justify-center">
        <Briefcase size={24} />
      </div>
      <p className="text-xs font-bold text-surface-200">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 text-surface-950 font-bold text-xs transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
