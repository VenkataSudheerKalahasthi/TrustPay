import { AlertOctagon } from 'lucide-react';

export function PlatformAlertCard({ alert }) {
  if (!alert) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">{alert.severity} SEVERITY</span>
          <h4 className="text-sm font-bold text-white">{alert.title}</h4>
          <p className="text-xs text-slate-400">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}
