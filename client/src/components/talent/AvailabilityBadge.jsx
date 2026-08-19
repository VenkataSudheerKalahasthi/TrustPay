export function AvailabilityBadge({ status = 'AVAILABLE' }) {
  const styles = {
    AVAILABLE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    BUSY: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    ON_VACATION: 'bg-sky-500/10 text-sky-400 dark:text-primary-400 border-sky-500/30',
    OFFLINE: 'bg-surface-50 text-surface-600 border-surface-300',
  };

  return (
    <span className={`text-3xs font-mono font-bold uppercase border px-2 py-0.5 rounded ${styles[status] || styles.AVAILABLE}`}>
      {status}
    </span>
  );
}

