import { ChevronLeft, ChevronRight } from 'lucide-react';

export function EnterprisePagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-400 py-3">
      <span>Page {currentPage} of {totalPages}</span>
      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
