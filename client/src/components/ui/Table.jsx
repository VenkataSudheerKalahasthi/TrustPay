import { cn } from '@utils';

export function Table({ children, className }) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-surface-800 bg-surface-900 shadow-glow-sm', className)}>
      <table className="w-full text-left text-sm border-collapse">{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-surface-800/80 text-xs font-semibold text-surface-400 uppercase tracking-wider border-b border-surface-700">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-surface-800/60">{children}</tbody>;
}

export function TableRow({ children, className, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'hover:bg-surface-800/40 transition-colors duration-150',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }) {
  return <th className={cn('px-4 py-3.5 font-semibold text-surface-300', className)}>{children}</th>;
}

export function TableCell({ children, className }) {
  return <td className={cn('px-4 py-3.5 text-surface-200 align-middle', className)}>{children}</td>;
}

