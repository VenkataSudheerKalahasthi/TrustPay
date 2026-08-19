export function EnterpriseTabs({ tabs = [], activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 border-b border-slate-800 pb-1">
      {tabs.map((tab) => {
        const isAct = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              isAct ? 'border-sky-500 text-sky-400 dark:text-primary-400 bg-sky-500/10' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
