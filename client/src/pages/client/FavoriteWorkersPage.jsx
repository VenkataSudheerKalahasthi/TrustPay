import { useState, useEffect } from 'react';
import { clientProfileService } from '@services/client.service';
import { WorkerCard } from '@components/worker/WorkerCard';
import { PageLoader } from '@components/error/PageLoader';
import { EmptyState } from '@components/ui/EmptyState';
import { Heart } from 'lucide-react';

export function FavoriteWorkersPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const res = await clientProfileService.getFavoriteWorkers();
      setFavorites(res || []);
    } catch {
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (workerProfileId) => {
    try {
      await clientProfileService.removeFavoriteWorker(workerProfileId);
      setFavorites((prev) => prev.filter((f) => f.workerProfileId !== workerProfileId));
    } catch {
      // ignore
    }
  };

  if (isLoading) return <PageLoader message="Loading Saved Favorites..." />;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-danger-50 text-danger-500 border border-danger-200">
          <Heart size={20} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display text-surface-900">Saved Favorite Workers</h1>
          <p className="text-xs text-surface-600">Shortlisted freelancers and specialists for upcoming contracts.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="No Favorite Workers Saved"
          description="Browse talent and click the heart icon on any worker card to save them to your favorites."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <WorkerCard
              key={fav.id}
              worker={fav.workerProfile}
              isFavorite={true}
              onToggleFavorite={() => handleRemoveFavorite(fav.workerProfileId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

