export function RestrictionBadge({ type }) {
  const styles = {
    WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    LIMITED_ACCESS: 'bg-sky-500/10 text-sky-400 dark:text-primary-400 border-sky-500/20',
    SUSPENDED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    BANNED: 'bg-red-600/20 text-red-500 border-red-600/30',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${styles[type] || styles.LIMITED_ACCESS}`}>
      {type || 'LIMITED_ACCESS'}
    </span>
  );
}
