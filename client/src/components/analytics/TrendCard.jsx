import { Card } from '@components/ui/Card';

export function TrendCard({ title, value, data = [], color = '#0ea5e9' }) {
  const points = data.length > 0 ? data : [10, 25, 18, 35, 28, 45, 40];
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const width = 120;
  const height = 36;

  const svgPoints = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card className="p-5 bg-surface-900 border-surface-800 flex items-center justify-between gap-4">
      <div>
        <span className="text-xs text-surface-400 font-semibold block mb-1">{title}</span>
        <h4 className="text-lg font-bold text-surface-50">{value}</h4>
      </div>

      <div className="shrink-0">
        <svg width={width} height={height} className="overflow-visible">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={svgPoints}
          />
        </svg>
      </div>
    </Card>
  );
}
