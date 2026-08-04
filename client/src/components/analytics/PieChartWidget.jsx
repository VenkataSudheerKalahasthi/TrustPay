import { Card } from '@components/ui/Card';

export function PieChartWidget({ title, data = [] }) {
  const defaultData = [
    { name: 'Active', value: 45, color: '#10b981' },
    { name: 'Completed', value: 35, color: '#0ea5e9' },
    { name: 'On Hold', value: 12, color: '#f59e0b' },
    { name: 'Cancelled', value: 8, color: '#ef4444' },
  ];

  const items = data.length > 0 ? data : defaultData;
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-5 bg-surface-900 border-surface-800 space-y-4">
      <h3 className="text-sm font-bold text-surface-100">{title}</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {items.map((item, idx) => {
              const previousSum = items.slice(0, idx).reduce((s, i) => s + i.value, 0);
              const strokeDasharray = `${(item.value / total) * 100} ${100 - (item.value / total) * 100}`;
              const strokeDashoffset = -((previousSum / total) * 100);

              return (
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="3.8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-surface-100">{total}</span>
            <span className="text-3xs text-surface-400">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-surface-300 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-surface-100">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
