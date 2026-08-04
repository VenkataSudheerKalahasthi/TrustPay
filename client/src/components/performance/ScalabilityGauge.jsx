import { ShieldCheck } from 'lucide-react';

export function ScalabilityGauge({ grade = 'A', notes = 'Enterprise-grade horizontal concurrency & SLA compliance' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-center">
      <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit mx-auto">
        <ShieldCheck className="w-10 h-10" />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Scalability Grade</span>
        <h2 className="text-5xl font-extrabold text-white tracking-tight">Grade {grade}</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">{notes}</p>
      </div>
    </div>
  );
}
