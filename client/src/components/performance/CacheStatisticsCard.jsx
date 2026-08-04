import { Zap } from 'lucide-react';

export function CacheStatisticsCard({ configs = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Cache Hit Ratios & TTL Strategy
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((c, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-white">{c.cacheKey}</span>
              <span className="text-emerald-400 font-bold">{c.hitRatio}% Hit</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Strategy: {c.strategy}</span>
              <span>TTL: {c.ttlSeconds}s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
