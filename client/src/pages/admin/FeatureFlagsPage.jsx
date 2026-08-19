import { useState, useEffect } from 'react';
import { ToggleLeft } from 'lucide-react';
import { adminService } from '@services/admin.service';
import { FeatureFlagToggle } from '@components/admin/FeatureFlagToggle';

export function FeatureFlagsPage() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlags() {
      try {
        const data = await adminService.getFeatureFlags();
        setFlags(data.featureFlags || []);
      } catch (err) {
        console.error('Failed to load feature flags', err);
      } finally {
        setLoading(false);
      }
    }
    loadFlags();
  }, []);

  const handleToggle = async (id, isEnabled) => {
    try {
      const updated = await adminService.toggleFeatureFlag(id, isEnabled);
      setFlags((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch (err) {
      console.error('Failed to toggle feature flag', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <ToggleLeft size={20} className="text-primary-600" />
          <span>Platform Feature Flags & Rollouts</span>
        </h1>
        <p className="text-xs text-surface-600">
          Control platform feature rollouts, targeting rules, and gradual rollout percentages.
        </p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-xs text-surface-600">Loading feature flags...</p>
        ) : (
          flags.map((flag) => (
            <FeatureFlagToggle key={flag.id} flag={flag} onToggle={handleToggle} />
          ))
        )}
      </div>
    </div>
  );
}

