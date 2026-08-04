import { Award } from 'lucide-react';

export function CertificationCard({ cert = {} }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Platform Release Certification
        </h3>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">{cert.status || 'CERTIFIED'}</span>
      </div>
      <div className="space-y-2 text-xs text-slate-300">
        <p><strong className="text-white">Certified Version:</strong> {cert.version || 'v2.0.0'}</p>
        <p><strong className="text-white">Certified By:</strong> {cert.certifiedBy || 'Enterprise Release Governance Board'}</p>
        <p><strong className="text-white">Stage:</strong> {cert.stage || 'PRODUCTION'}</p>
      </div>
    </div>
  );
}
