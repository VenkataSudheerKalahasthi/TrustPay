export function TicketStatusBadge({ status = 'OPEN' }) {
  const styles = {
    OPEN: 'bg-sky-500/10 text-sky-400 dark:text-primary-400 border-sky-500/20',
    IN_PROGRESS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    WAITING_CUSTOMER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ESCALATED: 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold',
    RESOLVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    CLOSED: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const style = styles[status] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
