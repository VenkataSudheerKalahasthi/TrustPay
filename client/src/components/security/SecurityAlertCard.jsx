import { AlertTriangle, Shield } from 'lucide-react';

export function SecurityAlertCard({ incident }) {
  const isHigh = incident.severity === 'HIGH' || incident.severity === 'CRITICAL';

  return (
    <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isHigh ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isHigh ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
        {isHigh ? <AlertTriangle size={16} /> : <Shield size={16} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-xs font-bold text-surface-100">{incident.title}</h4>
          <span className={`text-3xs font-mono uppercase font-bold px-2 py-0.5 rounded ${isHigh ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
            {incident.severity}
          </span>
        </div>
        <p className="text-3xs text-surface-300 line-clamp-2 mb-2">{incident.description}</p>
        <span className="text-3xs font-mono text-surface-500">Reported: {new Date(incident.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
