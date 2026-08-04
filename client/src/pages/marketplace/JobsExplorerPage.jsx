import { useState, useEffect, useCallback } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { marketplaceService } from '@services/marketplace.service';
import { JobCard } from '@components/marketplace/JobCard';
import { MarketplaceSearchBar } from '@components/marketplace/MarketplaceSearchBar';
import { MarketplaceLoadingSkeleton } from '@components/marketplace/MarketplaceLoadingSkeleton';
import { EmptyMarketplaceState } from '@components/marketplace/EmptyMarketplaceState';
import { MarketplaceErrorState } from '@components/marketplace/MarketplaceErrorState';

export function JobsExplorerPage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await marketplaceService.searchJobs({ query });
      setJobs(res.jobs || []);
    } catch (err) {
      console.error('Failed to load marketplace jobs', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
            <Briefcase size={20} className="text-primary-400" />
            <span>Talent Marketplace & Opportunities</span>
          </h1>
          <p className="text-xs text-surface-400">
            Discover verified enterprise opportunities, submit proposals, and transition to Escrow contracts.
          </p>
        </div>

        <Link
          to="/dashboard/client/marketplace/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 text-surface-950 font-bold text-xs transition-colors shrink-0"
        >
          <Plus size={16} />
          <span>Post Opportunity</span>
        </Link>
      </div>

      {/* Debounced Search Bar */}
      <MarketplaceSearchBar value={query} onChange={(q) => setQuery(q)} />

      {/* States */}
      {loading ? (
        <MarketplaceLoadingSkeleton count={6} />
      ) : error ? (
        <MarketplaceErrorState onRetry={loadJobs} />
      ) : jobs.length === 0 ? (
        <EmptyMarketplaceState actionText="Post First Job" onAction={() => setJobs([])} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
