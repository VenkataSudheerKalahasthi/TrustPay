import { useState, useEffect } from 'react';
import { executiveAnalyticsService } from '@services/executiveAnalytics.service';
import { ScheduleReportModal } from '@components/executive-analytics/ScheduleReportModal';
import { Calendar, Plus, Mail } from 'lucide-react';

export function ReportSchedulerPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await executiveAnalyticsService.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSchedule = async (data) => {
    await executiveAnalyticsService.createSubscription(data);
    fetchSubscriptions();
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-400" />
            Scheduled Reports & Automated Subscriptions
          </h1>
          <p className="text-slate-400 text-sm">Manage automated cron schedules for recurring email dispatch of executive reports</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No scheduled report subscriptions active</p>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">{sub.frequency}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{sub.email}</span>
              </div>
              <p className="text-xs text-slate-400">
                Format: <strong className="text-slate-200">{sub.format}</strong> • Next Run: <strong className="text-slate-200">{new Date(sub.nextRunAt).toLocaleDateString()}</strong>
              </p>
            </div>
          ))
        )}
      </div>

      <ScheduleReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
