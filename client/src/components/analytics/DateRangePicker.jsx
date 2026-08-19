import { Calendar } from 'lucide-react';

export function DateRangePicker({ selectedRange = 'MONTHLY', onChange }) {
  const ranges = [
    { id: 'DAILY', label: 'Daily' },
    { id: 'WEEKLY', label: 'Weekly' },
    { id: 'MONTHLY', label: 'Monthly' },
    { id: 'YEARLY', label: 'Yearly' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-card border border-surface-200 rounded-xl text-xs shrink-0">
      <Calendar size={14} className="text-surface-600 ml-2 mr-1" />
      {ranges.map((r) => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={`px-3 py-1 rounded-lg font-semibold transition-all ${
            selectedRange === r.id
              ? 'bg-primary-500 text-white shadow'
              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

