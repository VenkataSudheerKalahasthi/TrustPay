import { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { notificationService } from '@services/notification.service';
import { Button } from '@components/ui/Button';
import { ActivityTimeline } from '@components/notification/ActivityTimeline';

export function ActivityCenterPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getActivityFeed({
        category: selectedCategory || undefined,
        limit: 30,
      });
      setActivities(data.activities || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load activity stream');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Activity size={20} className="text-primary-600" />
          <span>Unified Activity Stream</span>
        </h1>
        <p className="text-xs text-surface-600">
          Chronological audit timeline of system events, authentication, projects, contracts, and payments.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 p-2 bg-card border border-surface-200 rounded-2xl overflow-x-auto text-xs scrollbar-hide">
        {[
          { id: '', label: 'All Activities' },
          { id: 'PROJECT', label: 'Projects' },
          { id: 'CONTRACT', label: 'Contracts' },
          { id: 'ESCROW', label: 'Escrow' },
          { id: 'PAYMENT', label: 'Payments' },
          { id: 'AUTH', label: 'Authentication' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-primary-500 text-white shadow'
                : 'bg-surface-50 text-surface-600 hover:text-surface-900'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-card border border-surface-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-card border border-red-500/30 text-center">
          <p className="text-xs text-red-400 mb-3">{error}</p>
          <Button size="sm" variant="secondary" onClick={fetchActivities} leftIcon={<RefreshCw size={14} />}>
            Retry
          </Button>
        </div>
      ) : (
        <ActivityTimeline activities={activities} />
      )}
    </div>
  );
}

