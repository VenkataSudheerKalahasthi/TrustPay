import { cn } from '@utils';

export function CharacterCounter({ current = 0, max = 100, className }) {
  const isNearLimit = current >= max * 0.9;
  const isAtLimit = current >= max;

  return (
    <span
      className={cn(
        'text-2xs font-mono select-none',
        isAtLimit ? 'text-danger-600 font-bold' : isNearLimit ? 'text-warning-400' : 'text-surface-500',
        className
      )}
    >
      {current} / {max}
    </span>
  );
}

