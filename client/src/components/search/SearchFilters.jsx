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
    <Card className="p-4 bg-card border-surface-200 space-y-3">
      <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider">Search Facets</h3>

      <div className="space-y-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onTypeChange(c.id)}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
              selectedType === c.id
                ? 'bg-primary-500 text-white shadow'
                : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
            }`}
          >
            <span>{c.label}</span>
            <span className={`text-3xs px-2 py-0.5 rounded-full ${selectedType === c.id ? 'bg-card/20 text-white' : 'bg-surface-50 text-surface-600'}`}>
              {c.count}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

