import { cn } from '@utils';
import { LoadingSpinner } from './LoadingSpinner';

export function Table({ children, className, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-surface-700/60 bg-surface-800/40 backdrop-blur-sm">
      <table className={cn('w-full text-left text-sm border-collapse', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

Table.Header = function TableHeader({ children, className, ...props }) {
  return (
    <thead className={cn('bg-surface-800/90 border-b border-surface-700 text-surface-400 font-medium uppercase text-xs tracking-wider', className)} {...props}>
      {children}
    </thead>
  );
};

Table.Body = function TableBody({ children, isLoading, isEmpty, emptyMessage = 'No data available', columnsCount = 5, className, ...props }) {
  if (isLoading) {
    return (
      <tbody className={className} {...props}>
        <tr>
          <td colSpan={columnsCount} className="py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <LoadingSpinner size="md" />
              <span className="text-xs text-surface-400">Loading data...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (isEmpty) {
    return (
      <tbody className={className} {...props}>
        <tr>
          <td colSpan={columnsCount} className="py-12 text-center text-surface-400 text-sm">
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return <tbody className={cn('divide-y divide-surface-700/50 text-surface-200', className)} {...props}>{children}</tbody>;
};

Table.Row = function TableRow({ children, className, ...props }) {
  return (
    <tr className={cn('hover:bg-surface-700/30 transition-colors', className)} {...props}>
      {children}
    </tr>
  );
};

Table.Head = function TableHead({ children, className, ...props }) {
  return (
    <th className={cn('px-4 py-3.5 font-semibold text-surface-300', className)} {...props}>
      {children}
    </th>
  );
};

Table.Cell = function TableCell({ children, className, ...props }) {
  return (
    <td className={cn('px-4 py-3.5 whitespace-nowrap', className)} {...props}>
      {children}
    </td>
  );
};
