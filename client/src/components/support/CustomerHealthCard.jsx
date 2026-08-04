import { HeartPulse } from 'lucide-react';

export function CustomerHealthCard({ health }) {
  if (!health) return null;

  const score = health.healthScore || 100;
  const isHealthy = score >= 80;
  const isCritical = score < 50;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl ${
              isHealthy ? 'bg-emerald-500/10 text-emerald-400' : isCritical ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Customer Health Score</h4>
            <p className="text-xs text-slate-400">CSAT adherence, open ticket SLA risk & disputes</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-3xl font-black font-mono ${isHealthy ? 'text-emerald-400' : isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
            {score}
          </span>
          <span className="text-xs text-slate-400 block font-semibold">/ 100 Index</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-slate-800 text-xs">
        <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Avg CSAT</span>
          <span className="font-bold text-white text-sm font-mono">{health.avgCsat || 5.0}★</span>
        </div>
        <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Open Tickets</span>
          <span className="font-bold text-sky-400 text-sm font-mono">{health.openTicketsCount || 0}</span>
        </div>
        <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Dispute Cases</span>
          <span className="font-bold text-rose-400 text-sm font-mono">{health.openDisputesCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
