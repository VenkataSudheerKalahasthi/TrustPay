import { useState } from 'react';
import { Card } from '@components/ui/Card';

export function LineChartWidget({ title, data = [], dataKey = 'gmv', color = '#0ea5e9' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

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

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <Card className="p-5 bg-surface-900 border-surface-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-surface-100">{title}</h3>
        {hoveredPoint && (
          <span className="text-xs font-mono font-semibold text-primary-400">
            {hoveredPoint.label}: ₹{hoveredPoint.value.toLocaleString()}
          </span>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" opacity="0.6" />

          {/* Polyline */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#0f172a"
                stroke={color}
                strokeWidth="2.5"
                className="cursor-pointer hover:r-7 transition-all"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text x={p.x} y={height - 8} fontSize="10" fill="#94a3b8" textAnchor="middle">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}
