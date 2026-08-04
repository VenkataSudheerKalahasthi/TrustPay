import { Card } from '@components/ui/Card';

export function SearchFilters({ selectedType, onTypeChange, facets = {} }) {
  const categories = [
    { id: 'ALL', label: 'All Categories', count: facets.ALL || 0 },
    { id: 'PROJECT', label: 'Projects', count: facets.PROJECT || 0 },
    { id: 'CONTRACT', label: 'Contracts', count: facets.CONTRACT || 0 },
    { id: 'WORKER', label: 'Workers', count: facets.WORKER || 0 },
    { id: 'MESSAGE', label: 'Messages', count: facets.MESSAGE || 0 },
  ];

  return (
    <Card className="p-4 bg-surface-900 border-surface-800 space-y-3">
      <h3 className="text-xs font-bold text-surface-200 uppercase tracking-wider">Search Facets</h3>

      <div className="space-y-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onTypeChange(c.id)}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
              selectedType === c.id
                ? 'bg-primary-500 text-white shadow-glow'
                : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
            }`}
          >
            <span>{c.label}</span>
            <span className={`text-3xs px-2 py-0.5 rounded-full ${selectedType === c.id ? 'bg-white/20 text-white' : 'bg-surface-800 text-surface-400'}`}>
              {c.count}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
