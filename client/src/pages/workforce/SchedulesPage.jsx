import { useState, useEffect } from 'react';
import { workforceService } from '@services/workforce.service';
import { ScheduleCalendar } from '@components/workforce/ScheduleCalendar';
import { ShiftCard } from '@components/workforce/ShiftCard';
import { CreateShiftModal } from '@components/workforce/CreateShiftModal';

export function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scheds, sfts] = await Promise.all([
        workforceService.getSchedules().catch(() => []),
        workforceService.getShifts().catch(() => []),
      ]);
      setSchedules(scheds);
      setShifts(sfts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white">Work Schedules & Shifts</h1>
        <p className="text-slate-400 text-sm">Configure working hours, shift templates, and worker assignments</p>
      </div>

      <ScheduleCalendar schedules={schedules} shifts={shifts} onCreateShift={() => setIsModalOpen(true)} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Active Shift Roster</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
        </div>
      </div>

      <CreateShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
