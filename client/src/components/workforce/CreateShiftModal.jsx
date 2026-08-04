import { useState, useEffect } from 'react';
import { X, Clock, Send } from 'lucide-react';
import { workforceService } from '@services/workforce.service';

export function CreateShiftModal({ isOpen, onClose, onSuccess }) {
  const [schedules, setSchedules] = useState([]);
  const [scheduleId, setScheduleId] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakDurationMins, setBreakDurationMins] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      workforceService.getSchedules().then((data) => {
        setSchedules(data);
        if (data.length > 0) {
          setScheduleId(data[0].id);
        }
      }).catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!scheduleId) {
        // Create default schedule if none exists
        const sched = await workforceService.createSchedule({ name: 'General Work Schedule' });
        await workforceService.createShift({
          scheduleId: sched.id,
          name,
          startTime,
          endTime,
          breakDurationMins: Number(breakDurationMins),
        });
      } else {
        await workforceService.createShift({
          scheduleId,
          name,
          startTime,
          endTime,
          breakDurationMins: Number(breakDurationMins),
        });
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Create Work Shift
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Shift Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Shift / Core Tech Hours"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Schedule</label>
            <select
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              {schedules.length === 0 ? (
                <option value="">Standard Schedule (Auto-create)</option>
              ) : (
                schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time (HH:mm)</label>
              <input
                type="text"
                required
                pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                placeholder="09:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Time (HH:mm)</label>
              <input
                type="text"
                required
                pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                placeholder="17:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Break Duration (Minutes)</label>
            <input
              type="number"
              min="0"
              value={breakDurationMins}
              onChange={(e) => setBreakDurationMins(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-sky-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Create Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
