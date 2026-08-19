import { Briefcase } from 'lucide-react';

export function EmptyMarketplaceState({ message = 'No job opportunities match your criteria.', actionText, onAction }) {
  return (
    <div className="p-8 rounded-2xl bg-card border border-surface-200 text-center space-y-3">
      <div className="p-3 rounded-2xl bg-surface-50 text-surface-600 w-12 h-12 mx-auto flex items-center justify-center">
        <Briefcase size={24} />
      </div>
      <p className="text-xs font-bold text-surface-800">{message}</p>
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

