import { useState } from 'react';
import { Download, ShieldCheck, CheckCircle } from 'lucide-react';
import { analyticsService } from '@services/analytics.service';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

export function ReportsPage() {
  const [reportType, setReportType] = useState('FINANCIAL');
  const [format, setFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('MONTHLY');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    try {
      const response = await analyticsService.exportReport({
        reportType,
        format,
        dateRange,
      });

      const blob = new Blob([response], {
        type: format === 'PDF' ? 'application/pdf' : 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TrustPay_${reportType}_Report.${format.toLowerCase()}`;
      a.click();

      setSuccessMsg(`Report (${reportType} - ${format}) generated and downloaded successfully!`);
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50">Enterprise Report Generator Workspace</h1>
        <p className="text-xs text-surface-400">
          Build and export customized PDF, CSV, and Excel financial, project, and escrow compliance reports.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <Card className="p-6 bg-surface-900 border-surface-800 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Report Category
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="FINANCIAL">Financial Overview & Escrow Audit</option>
                <option value="PROJECT">Project Milestone & Execution Progress</option>
                <option value="CONTRACT">Contract Compliance & Digital Signatures</option>
                <option value="WORKER_PERFORMANCE">Worker Deliverable Productivity</option>
                <option value="PLATFORM">System Operations & GMV Volume</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Time Window
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="DAILY">Daily Snapshot</option>
                <option value="WEEKLY">Weekly Summary</option>
                <option value="MONTHLY">Monthly Overview (Default)</option>
                <option value="YEARLY">Yearly Audit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-2">
              Select File Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'PDF', label: 'PDF Document', desc: 'PDFKit Formatted' },
                { id: 'CSV', label: 'CSV Spreadsheet', desc: 'Comma-Separated' },
                { id: 'EXCEL', label: 'Excel Worksheet', desc: 'Microsoft Excel' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    format === f.id
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-surface-700 bg-surface-800 text-surface-400 hover:text-surface-200'
                  }`}
                >
                  <span className="text-xs font-bold block mb-0.5">{f.label}</span>
                  <span className="text-3xs text-surface-500 block">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-400 flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-surface-200 block mb-0.5">Enterprise Security & Compliance</span>
              <span>
                All exported reports are compiled dynamically from verified database records with server-side authorization.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
            <Button type="submit" size="sm" loading={loading} leftIcon={<Download size={14} />}>
              Generate & Download Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
