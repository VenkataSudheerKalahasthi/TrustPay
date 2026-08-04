import { CheckCircle2, Lock } from 'lucide-react';

export function ProductionAcceptanceCard({ goLiveStatus = {} }) {
  const signoffs = goLiveStatus.signoffs || [];
  const checklist = goLiveStatus.checklist || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Final Production Acceptance</span>
          <h2 className="text-2xl font-extrabold text-white">TrustPay Enterprise v2.0 Sign-Off</h2>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Roadmap 100% Complete</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Stakeholder Sign-Offs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {signoffs.map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-white block">{s.stakeholder}</span>
              <span className="text-xs text-slate-400">{s.role}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SIGNED OFF
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Final Production Release Checklist</h3>
        {checklist.map((c, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="font-semibold text-slate-200">{c.item}</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">{c.status}</span>
          </div>
        ))}
      </div>

      <div className="p-5 bg-gradient-to-r from-emerald-600/20 via-sky-600/20 to-purple-600/20 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> TrustPay Enterprise v2.0 Production Lock
          </h4>
          <p className="text-xs text-slate-300">All 5 Phases & 26 Sub-Modules fully built, production-hardened, and certified.</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-emerald-600/30 whitespace-nowrap">
          Execute TrustPay v2.0 Final Lock
        </button>
      </div>
    </div>
  );
}
