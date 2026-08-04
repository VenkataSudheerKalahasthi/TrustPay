export function OnlineIndicator({ status = 'OFFLINE', size = 'sm' }) {
  const isOnline = status === 'ONLINE';
  const isAway = status === 'AWAY';
  const isBusy = status === 'BUSY';

  const sizeClasses = size === 'xs' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

  let colorClass = 'bg-surface-500';
  if (isOnline) colorClass = 'bg-emerald-400';
  else if (isAway) colorClass = 'bg-amber-400';
  else if (isBusy) colorClass = 'bg-red-400';

  return (
    <span
      className={`inline-block rounded-full ring-2 ring-surface-900 shrink-0 ${sizeClasses} ${colorClass}`}
      title={`Status: ${status}`}
    />
  );
}
