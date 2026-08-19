import { CheckCircle2, ShieldAlert } from 'lucide-react';

export function ReleaseCandidateCard({ status = {} }) {
  const rc = status.releaseCandidate || { version: 'v5.4.0-RC1', score: 98.5, isApproved: true };
  const checklist = status.checklist || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs text-sky-400 dark:text-primary-400 font-bold uppercase tracking-wider">Release Candidate</span>
          <h2 className="text-2xl font-extrabold text-white">{rc.version}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block">Readiness Score</span>
          <span className="text-2xl font-bold text-emerald-400">{rc.score}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Production Acceptance Checklist</h3>
        {checklist.map((c, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="font-semibold text-slate-200">{c.item}</span>
            <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" /> Approved for Immediate Production Release
        </span>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20">
          Deploy RC to Production
        </button>
      </div>
    </div>
  );
}
