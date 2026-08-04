import { Building2 } from 'lucide-react';

export function OrganizationAnalyticsChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Building2 className="w-5 h-5 text-indigo-400" />
        Enterprise Organization Growth & Tier Distribution
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Registered Enterprises</p>
          <p className="text-xl font-bold text-white">28 Organizations</p>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Avg Team Size</p>
          <p className="text-xl font-bold text-indigo-400">14 Members</p>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold">Enterprise Renewal Rate</p>
          <p className="text-xl font-bold text-emerald-400">97.4%</p>
        </div>
      </div>
    </div>
  );
}
