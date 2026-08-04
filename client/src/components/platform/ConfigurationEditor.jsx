import { Settings, Save } from 'lucide-react';

export function ConfigurationEditor({ configs = [], onSave }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-400" />
          Platform Key-Value Configuration Manager
        </h3>
      </div>

      <div className="space-y-3">
        {configs.map((cfg) => (
          <div key={cfg.id || cfg.configKey} className="flex items-center justify-between gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 block">{cfg.configKey}</span>
              <p className="text-[11px] text-slate-400">{cfg.description || 'Global configuration token'}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                defaultValue={cfg.configValue}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
              />
              {onSave && (
                <button
                  onClick={() => onSave(cfg.configKey, cfg.configValue)}
                  className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
