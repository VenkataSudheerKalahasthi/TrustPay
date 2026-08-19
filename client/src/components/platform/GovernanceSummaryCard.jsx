import { ShieldCheck, Award } from 'lucide-react';

export function GovernanceSummaryCard({ summary }) {
  return (
    <div className="bg-gradient-to-r from-slate-900 dark:from-[#0A120E] via-slate-900 dark:via-[#07100B] to-sky-950/40 dark:to-primary-950/20 border border-slate-800 dark:border-primary-900/30 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Enterprise Platform Governance Posture
        </h3>
        <span className="flex items-center gap-1 font-mono font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          <Award className="w-4 h-4" /> {summary?.compliancePosture || '100% COMPLIANT'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block">Current Version</span>
          <span className="font-bold font-mono text-white">v{summary?.currentVersion || '2.0.0'}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Active Runbooks</span>
          <span className="font-bold font-mono text-sky-400 dark:text-primary-400">{summary?.activeRunbooksCount || 2}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Upcoming Maintenance</span>
          <span className="font-bold font-mono text-amber-400">{summary?.upcomingMaintenanceCount || 0}</span>
        </div>
        <div>
          <span className="text-slate-400 block">System Health</span>
          <span className="font-bold font-mono text-emerald-400">{summary?.healthStatus || 'HEALTHY'}</span>
        </div>
      </div>
    </div>
  );
}
