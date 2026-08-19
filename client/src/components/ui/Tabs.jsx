import { cn } from '@utils';

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-surface-800 overflow-x-auto scrollbar-hide', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-3 text-xs font-semibold border-b-2 transition-all duration-150 whitespace-nowrap flex items-center gap-2 rounded-t-xl',
              isActive
                ? 'border-primary-500 text-primary-400 bg-primary-500/10'
                : 'border-transparent text-surface-400 hover:text-surface-200 hover:bg-surface-800/40'
            )}
          >
            {tab.icon && <tab.icon size={14} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-3xs bg-surface-800 text-surface-300 font-mono">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
