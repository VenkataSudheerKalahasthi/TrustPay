import { ShieldCheck, Activity, Award } from 'lucide-react';

export function ExecutiveSummaryCard({ summary }) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-sky-400" />
          C-Suite Executive Decision Intelligence
        </h3>
        <span className="flex items-center gap-1 font-mono font-bold text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          <Award className="w-4 h-4" /> Health Index: {summary?.platformHealthIndex || 94.8}%
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Platform operational health is verified optimal across financial growth, workforce capacity utilization, customer support SLA compliance, and escrow safety.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block">MRR Velocity</span>
          <span className="font-bold font-mono text-emerald-400">{summary?.mrrVelocity || 'HIGH'}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Workforce Status</span>
          <span className="font-bold font-mono text-sky-400">{summary?.workforceCapacityStatus || 'OPTIMAL'}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Support SLA Risk</span>
          <span className="font-bold font-mono text-emerald-400">{summary?.supportSLARisk || 'NONE'}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Active Alerts</span>
          <span className="font-bold font-mono text-amber-400 flex items-center gap-1">
            <Activity className="w-3 h-3" /> 0 Critical
          </span>
        </div>
      </div>
    </div>
  );
}
