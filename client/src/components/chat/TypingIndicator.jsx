export function TypingIndicator({ typingUsers = {} }) {
  const names = Object.values(typingUsers);
  if (names.length === 0) return null;

  const text =
    names.length === 1
      ? `${names[0]} is typing...`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing...`
      : 'Multiple users are typing...';

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-2xs text-surface-400 font-medium">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{text}</span>
    </div>
  );
}
