import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Bookmark, RefreshCw } from 'lucide-react';
import { searchService } from '@services/search.service';
import { Button } from '@components/ui/Button';
import { SearchResultCard } from '@components/search/SearchResultCard';
import { SearchFilters } from '@components/search/SearchFilters';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [facets, setFacets] = useState({});
  const [entityType, setEntityType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async () => {
    if (!queryParam) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchService.search({
        query: queryParam,
        entityType,
      });
      setResults(data.results || []);
      setFacets(data.facets || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to execute global search');
    } finally {
      setLoading(false);
    }
  }, [queryParam, entityType]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ query });
  };

  const handleSaveSearch = async () => {
    try {
      await searchService.saveSearch({
        name: `Saved Search: ${queryParam}`,
        query: queryParam,
      });
      alert('Search saved to your account!');
    } catch (err) {
      console.error('Failed to save search', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Search Input */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
              <Search size={20} className="text-primary-400" />
              <span>Unified Global Search</span>
            </h1>
            <p className="text-xs text-surface-400">
              Cross-module search across Projects, Contracts, Workers, Clients, Messages, and Payments.
            </p>
          </div>

          {queryParam && (
            <Button size="xs" variant="secondary" onClick={handleSaveSearch} leftIcon={<Bookmark size={14} />}>
              Save Search Filter
            </Button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, project numbers, contracts, chat messages..."
            className="w-full pl-11 pr-24 py-3 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold shadow-glow"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFilters selectedType={entityType} onTypeChange={setEntityType} facets={facets} />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-surface-900 border border-surface-800 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-surface-900 border border-red-500/30 text-center space-y-3">
              <p className="text-xs text-red-400">{error}</p>
              <Button size="sm" variant="secondary" onClick={fetchResults} leftIcon={<RefreshCw size={14} />}>
                Retry
              </Button>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface-900 border border-surface-800">
              <Search className="w-12 h-12 text-surface-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-surface-200">No Matching Results</h3>
              <p className="text-xs text-surface-400 max-w-xs mx-auto mt-1">
                We couldn't find any records matching "{queryParam}". Try searching for alternative keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-surface-400 font-semibold">
                Found {results.length} result(s) for "{queryParam}"
              </p>
              {results.map((r) => (
                <SearchResultCard
                  key={r.id}
                  result={r}
                  onResultClick={(id) => searchService.logClickAnalytics({ query: queryParam, clickedEntityId: id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
