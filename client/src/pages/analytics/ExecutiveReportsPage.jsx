import { useState, useEffect } from 'react';
import { analyticsService } from '@services/analytics.service';
import { ReportScheduleModal } from '@components/analytics/ReportScheduleModal';
import { FileText, Plus, Calendar } from 'lucide-react';

export function ExecutiveReportsPage() {
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [r, s] = await Promise.all([
        analyticsService.getExecutiveReports().catch(() => []),
        analyticsService.getReportSchedules().catch(() => []),
      ]);
      setReports(r);
      setSchedules(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleGenerateReport = async () => {
    try {
      await analyticsService.generateExecutiveReport({
        title: `C-Suite Strategic Executive Digest ${new Date().toLocaleDateString()}`,
        summary: 'Synthesized performance brief covering platform revenue, workforce allocations, and active dispute metrics.',
      });
      fetchReportsData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Executive Reports & Automated Schedules
          </h1>
          <p className="text-slate-400 text-sm">Strategic digest reports and automated cron-based email schedules</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all"
          >
            <Calendar className="w-4 h-4 text-sky-400 dark:text-primary-400" />
            Schedule Report
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            Generate Strategic Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Generated Strategic Briefs</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Report #</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500 font-medium">
                    No strategic reports generated yet
                  </td>
                </tr>
              ) : (
                reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400 dark:text-primary-400 text-xs">{rep.reportNumber}</td>
                    <td className="py-3 px-4 font-bold text-white">{rep.title}</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Automated Schedules</h3>
          <div className="space-y-3 text-xs">
            {schedules.length === 0 ? (
              <p className="text-slate-500 text-center py-6">No automated schedules configured</p>
            ) : (
              schedules.map((sch) => (
                <div key={sch.id} className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>{sch.title}</span>
                    <span className="text-sky-400 dark:text-primary-400 font-mono">{sch.frequency}</span>
                  </div>
                  <span className="text-slate-400 block font-mono text-[10px]">
                    Next Run: {new Date(sch.nextRunAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ReportScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSuccess={fetchReportsData}
      />
    </div>
  );
}
