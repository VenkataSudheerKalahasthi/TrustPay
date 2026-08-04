import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { GovernanceSummaryCard } from '@components/platform/GovernanceSummaryCard';
import { PlatformHealthCard } from '@components/platform/PlatformHealthCard';
import { ModuleStatusCard } from '@components/platform/ModuleStatusCard';
import { ReleaseTimeline } from '@components/platform/ReleaseTimeline';

export function PlatformDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [health, setHealth] = useState(null);
  const [modules, setModules] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      platformService.getGovernanceSummary().catch(() => null),
      platformService.getHealthStatus().catch(() => null),
      platformService.getModuleConfigurations().catch(() => []),
      platformService.getVersions().catch(() => []),
    ])
      .then(([sum, h, m, v]) => {
        setSummary(sum);
        setHealth(h);
        setModules(m);
        setVersions(v);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <GovernanceSummaryCard summary={summary} />

      <PlatformHealthCard health={health} />

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Platform Feature Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {modules.map((mod) => (
            <ModuleStatusCard key={mod.id || mod.moduleCode} module={mod} />
          ))}
        </div>
      </div>

      <ReleaseTimeline versions={versions} />
    </div>
  );
}
