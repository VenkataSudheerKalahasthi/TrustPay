import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export function SLAIndicator({ status = 'ON_TRACK', dueAt }) {
  const styles = {
    ON_TRACK: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    AT_RISK: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    BREACHED: 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold',
  };

  const style = styles[status] || styles.ON_TRACK;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {status === 'BREACHED' ? (
        <AlertTriangle className="w-3.5 h-3.5" />
      ) : status === 'AT_RISK' ? (
        <Clock className="w-3.5 h-3.5" />
      ) : (
        <ShieldCheck className="w-3.5 h-3.5" />
      )}
      <span>SLA: {status.replace('_', ' ')}</span>
      {dueAt && (
        <span className="text-[10px] opacity-80 border-l border-current pl-1.5 font-mono">
          Due: {new Date(dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}
