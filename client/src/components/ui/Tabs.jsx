import { useState } from 'react';
import { cn } from '@utils';

export function Tabs({ tabs = [], activeTab, onChange, className }) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : internalTab;

  const handleTabClick = (tabId) => {
    setInternalTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeContent = tabs.find((t) => t.id === currentTab)?.content;

  return (
    <div className={cn('flex flex-col w-full', className)}>
      <div className="flex items-center gap-2 border-b border-surface-700/80 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = tab.id === currentTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap',
                isActive
                  ? 'border-primary-500 text-primary-400 bg-primary-500/10 rounded-t-xl'
                  : 'border-transparent text-surface-400 hover:text-surface-200 hover:bg-surface-800/40 rounded-t-xl'
              )}
            >
              {Icon && <Icon size={16} />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-2xs bg-surface-700 text-surface-300 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeContent && <div className="py-4 text-surface-200">{activeContent}</div>}
    </div>
  );
}
