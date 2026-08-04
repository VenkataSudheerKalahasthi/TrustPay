import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { PlatformHealthCard } from '@components/platform/PlatformHealthCard';
import { ShieldCheck } from 'lucide-react';

export function PlatformHealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformService
      .getHealthStatus()
      .then((data) => setHealth(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Real-Time Health Monitoring & Observability
        </h1>
        <p className="text-slate-400 text-sm">PostgreSQL database pool status, Redis cache, API gateway, and uptime tracking</p>
      </div>

      <PlatformHealthCard health={health} />
    </div>
  );
}
