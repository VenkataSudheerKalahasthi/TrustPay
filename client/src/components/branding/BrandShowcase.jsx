import { Shield, ShoppingBag, Users, BarChart3 } from 'lucide-react';

export function BrandShowcase() {
  const modules = [
    { title: 'Digital Escrow Vault', desc: 'Milestone payment protection backed by instant automated settlement.', icon: Shield, color: 'text-sky-400 dark:text-primary-400 border-sky-500/20 bg-sky-500/10' },
    { title: 'Talent Marketplace', desc: 'Verified tech professionals, seamless hiring, and legal contract templates.', icon: ShoppingBag, color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
    { title: 'Workforce Operations', desc: 'Contingent workforce management, time tracking, and productivity scoring.', icon: Users, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { title: 'Executive Analytics', desc: 'C-suite decision intelligence, AI reports, and multi-format exports.', icon: BarChart3, color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-white">Unified Enterprise Capabilities</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">One integrated platform governing your entire contract & payment ecosystem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
              <div className={`p-3 rounded-xl border w-fit ${m.color}`}>
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
