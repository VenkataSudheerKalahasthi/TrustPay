import { AlertTriangle, Info, BellRing } from 'lucide-react';

export function ExecutiveAlertCard({ alert }) {
  if (!alert) return null;

  const severityColorMap = {
    CRITICAL: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    HIGH: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    MEDIUM: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    LOW: 'border-slate-700 bg-slate-800/40 text-slate-400',
  };

  const IconComponent = alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? AlertTriangle : alert.severity === 'MEDIUM' ? BellRing : Info;

  return (
    <div className={`border rounded-2xl p-5 shadow-xl flex items-start gap-4 ${severityColorMap[alert.severity] || severityColorMap.MEDIUM}`}>
      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">{alert.title}</h4>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">{alert.metricKey}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
        <p className="text-xs text-slate-500 font-mono pt-1">
          {new Date(alert.createdAt || Date.now()).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
