import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { workerService } from '@services/worker.service';
import { taxonomyService } from '@services/taxonomy.service';
import { clientProfileService } from '@services/client.service';
import { WorkerCard } from '@components/worker/WorkerCard';
import { WorkerFilterPanel } from '@components/worker/WorkerFilterPanel';
import { Pagination } from '@components/ui/Pagination';
import { PageLoader } from '@components/error/PageLoader';
import { EmptyState } from '@components/ui/EmptyState';
import { useAuth } from '@hooks/useAuth';

export function WorkerSearchPage() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    loadTaxonomies();
    if (user && user.role === 'CLIENT') {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, sortOption]);

  const loadTaxonomies = async () => {
    try {
      const data = await taxonomyService.getTaxonomies();
      setCategories(data.categories || []);
    } catch {
      // ignore
    }
  };

  const loadFavorites = async () => {
    try {
      const favs = await clientProfileService.getFavoriteWorkers();
      const ids = new Set(favs.map((f) => f.workerProfileId));
      setFavoriteIds(ids);
    } catch {
      // ignore
    }
  };

  const fetchWorkers = async () => {
    try {
      setIsLoading(true);
      const res = await workerService.searchWorkers({
        q: searchQuery || undefined,
        ...filters,
        sort: sortOption,
        page: currentPage,
        limit: 9,
      });
      setWorkers(res.workers || []);
      setTotalPages(res.totalPages || 1);
    } catch {
      setWorkers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchWorkers();
  };

  const handleToggleFavorite = async (workerProfileId) => {
    if (!user || user.role !== 'CLIENT') return;
    try {
      if (favoriteIds.has(workerProfileId)) {
        await clientProfileService.removeFavoriteWorker(workerProfileId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(workerProfileId);
          return next;
        });
      } else {
        await clientProfileService.addFavoriteWorker(workerProfileId);
        setFavoriteIds((prev) => new Set(prev).add(workerProfileId));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold font-display tracking-tight text-surface-50">
            Find Verified Talent & Specialists
          </h1>
          <p className="text-sm text-surface-400 max-w-2xl">
            Browse verified freelancers, explore portfolios, and hire safely with TrustPay milestone escrow protection.
          </p>
        </div>

        {/* Search Bar & Action Controls */}
        <div className="glass-card p-4 flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skill, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-950 border border-surface-800 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500"
            />
            <Search size={18} className="absolute left-3 top-3 text-surface-500" />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-3 py-2 rounded-xl bg-surface-800 text-surface-200 text-xs font-semibold flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>

            {/* Sorting Select */}
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <ArrowUpDown size={14} />
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-surface-950 border border-surface-800 text-surface-200 py-2 px-3 rounded-xl focus:outline-none focus:border-primary-500 text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="experience">Most Experienced</option>
                <option value="rate_asc">Hourly Rate: Low to High</option>
                <option value="rate_desc">Hourly Rate: High to Low</option>
                <option value="completion">Profile Completion</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid & Filters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            <WorkerFilterPanel
              categories={categories}
              onApplyFilters={(f) => {
                setFilters(f);
                setCurrentPage(1);
              }}
              onResetFilters={() => {
                setFilters({});
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Worker Cards Grid */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {isLoading ? (
              <PageLoader message="Loading Verified Workers..." />
            ) : workers.length === 0 ? (
              <EmptyState
                title="No Workers Found"
                description="Try adjusting your search criteria or resetting filters."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      isFavorite={favoriteIds.has(worker.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
