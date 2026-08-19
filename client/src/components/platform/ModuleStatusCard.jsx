import { Layers, CheckCircle2 } from 'lucide-react';

export function ModuleStatusCard({ module }) {
  if (!module) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-sky-500/10 text-sky-400 dark:text-primary-400 rounded-xl">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase font-mono">{module.moduleCode}</h4>
          <p className="text-xs text-slate-400">Status: {module.isEnabled ? 'Active' : 'Disabled'}</p>
        </div>
      </div>

      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3" /> Operational
      </span>
    </div>
  );
}
