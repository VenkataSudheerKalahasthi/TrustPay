import { cn } from '@utils';

export function SectionDivider({ title, description, className }) {
  return (
    <div className={cn('my-4 border-t border-surface-700/60 pt-4', className)}>
      {title && <h4 className="text-sm font-bold text-surface-200 uppercase tracking-wider">{title}</h4>}
      {description && <p className="text-xs text-surface-400 mt-0.5">{description}</p>}
    </div>
  );
}
