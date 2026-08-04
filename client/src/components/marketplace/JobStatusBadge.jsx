export function JobStatusBadge({ status = 'OPEN' }) {
  const styles = {
    OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    DRAFT: 'bg-surface-800 text-surface-400 border-surface-700',
    PAUSED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    FILLED: 'bg-primary-500/10 text-primary-400 border-primary-500/30',
    EXPIRED: 'bg-red-500/10 text-red-400 border-red-500/30',
    CANCELLED: 'bg-surface-800 text-surface-500 border-surface-700',
  };

  return (
    <span className={`text-3xs font-mono font-bold uppercase border px-2 py-0.5 rounded ${styles[status] || styles.OPEN}`}>
      {status}
    </span>
  );
}
