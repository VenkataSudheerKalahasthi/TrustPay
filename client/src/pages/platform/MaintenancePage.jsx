import { useState, useEffect } from 'react';
import { platformService } from '@services/platform.service';
import { MaintenanceCalendar } from '@components/platform/MaintenanceCalendar';
import { CreateScheduleModal } from '@components/platform/CreateScheduleModal';
import { Calendar, Plus } from 'lucide-react';

export function MaintenancePage() {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await platformService.getMaintenanceSchedules();
      setSchedules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-400" />
            Platform Maintenance Scheduler
          </h1>
          <p className="text-slate-400 text-sm">Schedule system maintenance windows and notify active tenant organizations</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Schedule Maintenance
        </button>
      </div>

      <MaintenanceCalendar schedules={schedules} />

      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSchedules}
      />
    </div>
  );
}
