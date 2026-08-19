import { Layout, Plus } from 'lucide-react';

export function DashboardCustomizationPanel({ dashboard, onAddWidget }) {
  if (!dashboard) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-sky-400 dark:text-primary-400" />
            Dashboard Widget Customization Panel
          </h3>
          <p className="text-xs text-slate-400">Add KPI scorecards, charts, and telemetry widgets to your active layout</p>
        </div>

        <button
          onClick={onAddWidget}
          className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Widget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(dashboard.widgets || []).length === 0 ? (
          <div className="col-span-full py-8 text-center border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400">Default grid layout active. Click Add Widget to insert custom telemetries.</p>
          </div>
        ) : (
          dashboard.widgets.map((w) => (
            <div key={w.id} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{w.title}</p>
                <p className="text-xs text-slate-400">{w.type} • {w.metricKey}</p>
              </div>
              <span className="text-xs text-sky-400 dark:text-primary-400 font-mono">[{w.width}x{w.height}]</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
