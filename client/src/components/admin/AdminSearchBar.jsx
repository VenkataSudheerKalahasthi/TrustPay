import { Search } from 'lucide-react';

export function AdminSearchBar({ value, onChange, onSearch, placeholder }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch && onSearch(); }} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder={placeholder || 'Search by email, name, or ID...'}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-sky-600/20"
      >
        Search
      </button>
    </form>
  );
}
