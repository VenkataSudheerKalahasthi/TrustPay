import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function ScheduleCalendar({ shifts = [], onCreateShift }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' },
  ];

  const filteredShifts = shifts.filter((s) => {
    try {
      const parsedDays = JSON.parse(s.daysOfWeek || '[]');
      return parsedDays.includes(selectedDay);
    } catch {
      return true;
    }
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-sky-400 dark:text-primary-400" />
            Work Schedule Calendar
          </h3>
          <p className="text-slate-400 text-sm">View shifts, working hours, and worker assignments</p>
        </div>
        {onCreateShift && (
          <button
            onClick={onCreateShift}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg text-sm transition-colors shadow-lg shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Shift
          </button>
        )}
      </div>

      {/* Day Selector */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day) => {
          const isSelected = selectedDay === day.id;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`py-3 px-2 text-center rounded-lg text-xs md:text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {day.name.slice(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Shift Items Grid */}
      <div className="space-y-3">
        {filteredShifts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-lg">
            <Clock className="w-8 h-8 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">No shifts scheduled for this day</p>
          </div>
        ) : (
          filteredShifts.map((shift) => (
            <motion.div
              key={shift.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-sky-500/10 text-sky-400 dark:text-primary-400 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{shift.name}</h4>
                  <p className="text-xs text-slate-400">
                    {shift.startTime} - {shift.endTime} ({shift.breakDurationMins} min break)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {shift.assignedUser ? (
                  <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                    <User className="w-3.5 h-3.5 text-sky-400 dark:text-primary-400" />
                    <span className="text-xs font-medium text-slate-200">
                      {shift.assignedUser.firstName} {shift.assignedUser.lastName}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 font-medium">
                    Unassigned
                  </span>
                )}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    shift.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {shift.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
