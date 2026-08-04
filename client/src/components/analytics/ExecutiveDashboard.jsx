import { LayoutGrid } from 'lucide-react';
import { KPIWidget } from './KPIWidget';

export function ExecutiveDashboard({ dashboard, kpis = [], onCustomize }) {
  if (!dashboard) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">{dashboard.visibility} View</span>
          <h2 className="text-2xl font-black text-white mt-1">{dashboard.title}</h2>
          {dashboard.description && <p className="text-xs text-slate-400 mt-0.5">{dashboard.description}</p>}
        </div>

        {onCustomize && (
          <button
            onClick={onCustomize}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-sky-400" />
            Customize Layout
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 4).map((kpi) => (
          <KPIWidget key={kpi.id || kpi.code} kpi={kpi} />
        ))}
      </div>
    </div>
  );
}
