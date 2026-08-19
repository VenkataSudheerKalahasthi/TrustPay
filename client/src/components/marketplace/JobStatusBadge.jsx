export function JobStatusBadge({ status = 'OPEN' }) {
  const styles = {
    OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    DRAFT: 'bg-surface-50 text-surface-600 border-surface-300',
    PAUSED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    FILLED: 'bg-primary-50 text-primary-600 border-primary-600/30',
    EXPIRED: 'bg-red-500/10 text-red-400 border-red-500/30',
    CANCELLED: 'bg-surface-50 text-surface-500 border-surface-300',
  };

  return (
    <span className={`text-3xs font-mono font-bold uppercase border px-2 py-0.5 rounded ${styles[status] || styles.OPEN}`}>
      {status}
    </span>
  );
}

