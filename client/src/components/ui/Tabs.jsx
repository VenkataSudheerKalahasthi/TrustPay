import { cn } from '@utils';

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-surface-200 overflow-x-auto scrollbar-hide', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-3 text-xs font-semibold border-b-2 transition-all duration-150 whitespace-nowrap flex items-center gap-2 rounded-t-xl',
              isActive
                ? 'border-primary-600 text-primary-700 bg-primary-50'
                : 'border-transparent text-surface-500 hover:text-surface-900 hover:bg-surface-100'
            )}
          >
            {tab.icon && <tab.icon size={14} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-3xs bg-surface-200 text-surface-700 font-mono">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
