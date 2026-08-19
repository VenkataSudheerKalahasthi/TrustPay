import { Card } from '@components/ui/Card';

export function BarChartWidget({ title, data = [], dataKey = 'projects', color = '#6366f1' }) {
  if (data.length === 0) return null;

  const values = data.map((d) => Number(d[dataKey] || 0));
  const max = Math.max(...values, 1);

  return (
    <Card className="p-5 bg-card border-surface-200 space-y-4">
      <h3 className="text-sm font-bold text-surface-900">{title}</h3>

      <div className="flex items-end justify-between gap-3 h-44 pt-6">
        {data.map((item, idx) => {
          const val = Number(item[dataKey] || 0);
          const heightPercent = Math.max(10, Math.min(100, (val / max) * 100));

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-2xs font-semibold text-surface-600 group-hover:text-primary-600 transition-colors">
                {val}
              </span>
              <div className="w-full bg-surface-50 rounded-t-xl overflow-hidden h-full flex items-end">
                <div
                  className="w-full rounded-t-xl transition-all duration-500 group-hover:opacity-90"
                  style={{ height: `${heightPercent}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-3xs text-surface-600 font-medium truncate w-full text-center">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

