import { useState, useEffect } from 'react';
import { executiveAnalyticsService } from '@services/executiveAnalytics.service';
import { ReportExportModal } from '@components/executive-analytics/ReportExportModal';
import { FileText, Download, Plus } from 'lucide-react';

export function ExecutiveReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await executiveAnalyticsService.getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    const title = prompt('Enter report title:');
    if (!title) return;
    try {
      await executiveAnalyticsService.createReport({
        title,
        summary: 'Automated executive strategic report generated for C-suite review.',
        metrics: { escrowVolume: 6800000, activeWorkers: 290 },
      });
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleExport = async (reportId, format) => {
    await executiveAnalyticsService.exportReport(reportId, format);
    alert(`Report exported successfully as ${format}`);
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            Executive Reports & AI Generation Engine
          </h1>
          <p className="text-slate-400 text-sm">Generate, inspect, and export C-suite financial, operational, and strategic reports</p>
        </div>

        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Generate Executive Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No executive reports generated yet</p>
          </div>
        ) : (
          reports.map((rpt) => (
            <div key={rpt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-sky-400 font-bold">{rpt.reportNumber}</span>
                <span className="text-xs text-slate-500">{new Date(rpt.generatedAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{rpt.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{rpt.summary}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">By: {rpt.author?.firstName} {rpt.author?.lastName}</span>
                <button
                  onClick={() => {
                    setSelectedReportId(rpt.id);
                    setIsExportOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold rounded-lg transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ReportExportModal
        isOpen={isExportOpen}
        reportId={selectedReportId}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}
