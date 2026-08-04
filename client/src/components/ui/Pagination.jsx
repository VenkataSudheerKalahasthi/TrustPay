import { cn } from '@utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 text-xs text-surface-400', className)}>
      <div className="flex items-center gap-2">
        {totalItems !== undefined && (
          <span>
            Showing <strong className="text-surface-200">{Math.min((currentPage - 1) * (pageSize || 10) + 1, totalItems)}</strong> to{' '}
            <strong className="text-surface-200">{Math.min(currentPage * (pageSize || 10), totalItems)}</strong> of{' '}
            <strong className="text-surface-200">{totalItems}</strong> entries
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1 ml-2">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-surface-800 border border-surface-700 text-surface-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors',
              currentPage === p
                ? 'bg-primary-600 text-white'
                : 'text-surface-300 hover:bg-surface-800'
            )}
          >
            {p}
          </button>
        ))}

        <Button
          variant="ghost"
          size="xs"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
