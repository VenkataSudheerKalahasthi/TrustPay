import { Card } from '@components/ui/Card';

export function AreaChartWidget({ title, data = [], dataKey = 'revenue', color = '#10b981' }) {
  if (data.length === 0) return null;

  const width = 500;
  const height = 200;
  const padding = 30;

  const values = data.map((d) => Number(d[dataKey] || 0));
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((Number(d[dataKey] || 0) - min) / range) * (height - padding * 2);
    return { x, y, label: d.name, value: d[dataKey] };
  });

  const pathD = `M ${points[0].x} ${height - padding} L ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${points[points.length - 1].x} ${height - padding} Z`;
  const lineD = `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`;

  return (
    <Card className="p-5 bg-card border-surface-200 space-y-3">
      <h3 className="text-sm font-bold text-surface-900">{title}</h3>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id={`area-grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={pathD} fill={`url(#area-grad-${dataKey})`} />

          {/* Top Line */}
          <path d={lineD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />

          {/* Labels */}
          {points.map((p, idx) => (
            <text key={idx} x={p.x} y={height - 8} fontSize="10" fill="#94a3b8" textAnchor="middle">
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
}

