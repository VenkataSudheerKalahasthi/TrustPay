import { useState, useEffect } from 'react';
import { workforceService } from '@services/workforce.service';
import { TimesheetTable } from '@components/workforce/TimesheetTable';
import { FileText, Send } from 'lucide-react';

export function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const data = await workforceService.getTimesheets();
      setTimesheets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await workforceService.reviewTimesheet(id, { status });
      fetchTimesheets();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleQuickSubmit = async () => {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      await workforceService.submitTimesheet({
        startDate: lastWeek.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        notes: 'Weekly Timesheet Submission',
      });
      fetchTimesheets();
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
            Timesheets & Billable Hours
          </h1>
          <p className="text-slate-400 text-sm">Submit weekly time logs, review worker hours, and prepare payroll</p>
        </div>

        <button
          onClick={handleQuickSubmit}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Send className="w-4 h-4" />
          Submit Weekly Timesheet
        </button>
      </div>

      <TimesheetTable timesheets={timesheets} onReview={handleReview} isManager={true} />
    </div>
  );
}
