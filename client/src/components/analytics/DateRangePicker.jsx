import { Calendar } from 'lucide-react';

export function DateRangePicker({ selectedRange = 'MONTHLY', onChange }) {
  const ranges = [
    { id: 'DAILY', label: 'Daily' },
    { id: 'WEEKLY', label: 'Weekly' },
    { id: 'MONTHLY', label: 'Monthly' },
    { id: 'YEARLY', label: 'Yearly' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-surface-900 border border-surface-800 rounded-xl text-xs shrink-0">
      <Calendar size={14} className="text-surface-400 ml-2 mr-1" />
      {ranges.map((r) => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={`px-3 py-1 rounded-lg font-semibold transition-all ${
            selectedRange === r.id
              ? 'bg-primary-500 text-white shadow-glow'
              : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
