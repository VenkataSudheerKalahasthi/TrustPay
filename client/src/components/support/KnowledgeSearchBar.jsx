import { Search } from 'lucide-react';

export function KnowledgeSearchBar({ query, onQueryChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search help articles, guides, FAQs, policies..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-xl"
      />
    </form>
  );
}
