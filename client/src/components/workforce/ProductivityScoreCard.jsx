import { TrendingUp, Award, Zap, ShieldCheck } from 'lucide-react';

export function ProductivityScoreCard({ metrics }) {
  const prodScore = metrics?.productivityScore || 95.0;
  const utilPct = metrics?.utilizationPct || 92.4;
  const attendPct = metrics?.attendancePct || 98.0;
  const effScore = metrics?.efficiencyScore || 94.6;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Productivity & Efficiency Index
          </h3>
          <p className="text-xs text-slate-400">Automated performance and billable utilization scoring</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-emerald-400 font-mono">{prodScore}</span>
          <span className="text-xs text-slate-400 block font-semibold">/ 100 Score</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
          <Zap className="w-4 h-4 text-sky-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-white block">{utilPct}%</span>
          <span className="text-[11px] text-slate-400">Billable Utilization</span>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-white block">{attendPct}%</span>
          <span className="text-[11px] text-slate-400">Attendance Adherence</span>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
          <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-white block">{effScore}%</span>
          <span className="text-[11px] text-slate-400">Work Efficiency</span>
        </div>
      </div>
    </div>
  );
}
