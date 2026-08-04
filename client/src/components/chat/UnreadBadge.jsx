export function UnreadBadge({ count = 0 }) {
  if (!count || count <= 0) return null;

  return (
    <span className="px-2 py-0.5 rounded-full bg-primary-500 text-white font-bold text-2xs min-w-[1.25rem] text-center shadow-glow">
      {count > 99 ? '99+' : count}
    </span>
  );
}
