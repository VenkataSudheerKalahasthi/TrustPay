import { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function ExportDialog({ isOpen, onClose, onExport, isExporting }) {
  const [reportType, setReportType] = useState('FINANCIAL');
  const [format, setFormat] = useState('PDF');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onExport({ reportType, format });
  };

  return (
    <div className="fixed inset-0 z-modal bg-card/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-surface-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary-600" />
            <h3 className="text-base font-semibold text-surface-900">Export Analytics Report</h3>
          </div>
          <button onClick={onClose} className="text-surface-600 hover:text-surface-900 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            >
              <option value="FINANCIAL">Financial Overview & Escrow Report</option>
              <option value="PROJECT">Project Execution & Progress Report</option>
              <option value="CONTRACT">Contract Compliance & Audit Report</option>
              <option value="WORKER_PERFORMANCE">Worker Productivity Report</option>
              <option value="PLATFORM">Platform Operations Summary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'PDF', label: 'PDF Document' },
                { id: 'CSV', label: 'CSV File' },
                { id: 'EXCEL', label: 'Excel (.xls)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    format === f.id
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-surface-300 bg-surface-50 text-surface-600 hover:text-surface-800'
                  }`}
                >
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-200">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isExporting} leftIcon={<Download size={14} />}>
              Generate Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

