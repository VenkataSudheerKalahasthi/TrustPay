import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X, ArrowRight } from 'lucide-react';
import { searchService } from '@services/search.service';

export function GlobalSearchBar({ onOpenCommandPalette }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const data = await searchService.getSuggestions(query);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('Failed to load search suggestions', err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search projects, contracts, users..."
          className="w-full pl-10 pr-16 py-2 rounded-xl bg-surface-900 border border-surface-800 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-surface-400 hover:text-surface-100 p-0.5"
            >
              <X size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-800 text-3xs font-mono text-surface-400 hover:text-surface-200"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command size={10} />
              <span>K</span>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Popover */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-surface-900 border border-surface-800 shadow-2xl z-dropdown overflow-hidden divide-y divide-surface-800">
          <div className="p-2 space-y-1">
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setOpen(false);
                  navigate(item.linkUrl);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-surface-800 transition-colors flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-bold text-surface-100 block truncate">{item.title}</span>
                  <span className="text-3xs text-surface-400 block truncate">{item.subtitle}</span>
                </div>
                <ArrowRight size={14} className="text-surface-500 group-hover:text-primary-400 shrink-0" />
              </button>
            ))}
          </div>
          <div className="p-2 bg-surface-950 text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-xs font-semibold text-primary-400 hover:underline"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
