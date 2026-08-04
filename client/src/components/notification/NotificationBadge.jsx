export function NotificationBadge({ count = 0 }) {
  if (!count || count <= 0) return null;

  return (
    <span className="relative flex h-4 w-4">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-3xs font-bold items-center justify-center">
        {count > 99 ? '99+' : count}
      </span>
    </span>
  );
}
