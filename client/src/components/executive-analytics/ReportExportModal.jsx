import { useState } from 'react';
import { Download, X, FileText, FileSpreadsheet, Code } from 'lucide-react';

export function ReportExportModal({ isOpen, reportId, onClose, onExport }) {
  const [format, setFormat] = useState('PDF');
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setExporting(true);
      await onExport(reportId, format);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setExporting(false);
    }
  };

  const formats = [
    { id: 'PDF', label: 'PDF Document', icon: FileText, desc: 'C-suite presentation format' },
    { id: 'XLSX', label: 'Excel Spreadsheet', icon: FileSpreadsheet, desc: 'Financial raw data tables' },
    { id: 'CSV', label: 'CSV Dataset', icon: FileText, desc: 'Flat data dump' },
    { id: 'JSON', label: 'JSON Data Stream', icon: Code, desc: 'Programmatic API export' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-sky-400" />
            Export Executive Report
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-400">Select export format for report generation:</p>
          <div className="grid grid-cols-2 gap-3">
            {formats.map((f) => {
              const IconComp = f.icon;
              const isSel = format === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    isSel ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isSel ? 'text-sky-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-bold">{f.label}</p>
                  <p className="text-[10px] text-slate-500">{f.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50"
          >
            {exporting ? 'Generating...' : `Export ${format}`}
          </button>
        </div>
      </div>
    </div>
  );
}
