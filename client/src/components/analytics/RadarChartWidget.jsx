import { Card } from '@components/ui/Card';

export function RadarChartWidget({ title, data = [] }) {
  const defaultData = [
    { subject: 'Milestones', A: 90 },
    { subject: 'Quality', A: 95 },
    { subject: 'Communication', A: 88 },
    { subject: 'Compliance', A: 98 },
    { subject: 'Evidence', A: 100 },
  ];

  const items = data.length > 0 ? data : defaultData;

  return (
    <Card className="p-5 bg-surface-900 border-surface-800 space-y-4">
      <h3 className="text-sm font-bold text-surface-100">{title}</h3>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-2xs font-semibold">
              <span className="text-surface-300">{item.subject}</span>
              <span className="text-primary-400 font-mono">{item.A}%</span>
            </div>
            <div className="w-full bg-surface-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${item.A}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
