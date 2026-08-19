import { LayoutGrid, Check } from 'lucide-react';

export function DashboardCustomizer({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-sky-400 dark:text-primary-400" />
          Customize Dashboard Layout
        </h3>
        <p className="text-xs text-slate-400">Configure grid widget positioning and visibility</p>

        <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
          <label className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
            <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-sky-500" />
            <span>Monthly Recurring Revenue (MRR) Widget</span>
          </label>
          <label className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
            <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-sky-500" />
            <span>Workforce Utilization Widget</span>
          </label>
          <label className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
            <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-sky-500" />
            <span>Customer Satisfaction (CSAT) Widget</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => {
              if (onSave) onSave();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-sky-600/20"
          >
            <Check className="w-4 h-4" />
            Save Layout
          </button>
        </div>
      </div>
    </div>
  );
}
