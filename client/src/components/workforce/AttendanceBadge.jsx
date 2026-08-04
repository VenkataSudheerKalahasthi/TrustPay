export function AttendanceBadge({ status = 'PRESENT' }) {
  const badgeStyles = {
    PRESENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ABSENT: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    LATE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    REMOTE: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    HALF_DAY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const style = badgeStyles[status] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {status}
    </span>
  );
}
