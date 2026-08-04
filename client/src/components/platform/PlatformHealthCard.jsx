import { ShieldCheck, Activity } from 'lucide-react';

export function PlatformHealthCard({ health }) {
  const isHealthy = health?.overallHealth === 'HEALTHY' || !health;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          System Health Monitoring
        </h3>

        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            isHealthy
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          {health?.overallHealth || 'HEALTHY'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block">Database Pool</span>
          <span className="font-bold font-mono text-emerald-400">{health?.details?.database || 'HEALTHY'}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Redis Cache</span>
          <span className="font-bold font-mono text-emerald-400">{health?.details?.redisCache || 'HEALTHY'}</span>
        </div>
        <div>
          <span className="text-slate-400 block">API Gateway</span>
          <span className="font-bold font-mono text-emerald-400">{health?.details?.apiGateway || 'HEALTHY'}</span>
        </div>
      </div>
    </div>
  );
}
