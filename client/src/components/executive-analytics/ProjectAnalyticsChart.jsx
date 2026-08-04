import { Briefcase } from 'lucide-react';

export function ProjectAnalyticsChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-sky-400" />
        Project Milestone Progress & Completion Velocity
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Active Digital Contracts</p>
          <p className="text-xl font-bold text-white">142 Active</p>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Milestone Approval SLA</p>
          <p className="text-xl font-bold text-emerald-400">1.8 Days Avg</p>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Dispute Frequency</p>
          <p className="text-xl font-bold text-sky-400">1.4% Rate</p>
        </div>
      </div>
    </div>
  );
}
