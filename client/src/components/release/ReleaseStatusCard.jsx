import { ShieldCheck } from 'lucide-react';

export function ReleaseStatusCard({ version = 'v2.0.0', status = 'CERTIFIED', readinessPct = 100.0 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Enterprise Release Certification
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">{version} <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">{status}</span></h2>
        <p className="text-xs text-slate-400">TrustPay Enterprise v2.0 is 100% production ready & certified for global deployment</p>
      </div>
      <div className="text-right space-y-1">
        <span className="text-xs font-semibold text-slate-400">Go-Live Readiness</span>
        <h3 className="text-3xl font-extrabold text-emerald-400">{readinessPct}%</h3>
      </div>
    </div>
  );
}
