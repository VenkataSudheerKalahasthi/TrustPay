import { Building } from 'lucide-react';

export function CustomerTrustSection() {
  const partners = ['Acme Global', 'TechCorp Software', 'Apex Financial', 'Vertex Labs', 'Omni Cloud'];

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto text-center space-y-6">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trusted by Enterprise Leaders Worldwide</p>
      <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 font-bold text-sm">
        {partners.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">
            <Building className="w-4 h-4 text-sky-400" />
            <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
