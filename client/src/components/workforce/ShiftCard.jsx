import { Clock, Calendar, AlertCircle } from 'lucide-react';

export function ShiftCard({ shift, onAssign }) {
  if (!shift) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 dark:text-primary-400 font-semibold">
            {shift.schedule?.name || 'Standard Shift'}
          </span>
          <h4 className="text-lg font-bold text-white mt-0.5">{shift.name}</h4>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            shift.status === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : shift.status === 'COMPLETED'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          {shift.status}
        </span>
      </div>

      <div className="space-y-2 text-xs text-slate-300 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>
            {shift.startTime} – {shift.endTime} ({shift.breakDurationMins || 60}m break)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Days: {shift.daysOfWeek}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        {shift.assignedUser ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
              {shift.assignedUser.firstName?.[0]}
            </div>
            <span className="text-xs text-slate-200 font-medium">
              {shift.assignedUser.firstName} {shift.assignedUser.lastName}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-400 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Unassigned Shift</span>
          </div>
        )}

        {onAssign && (
          <button
            onClick={() => onAssign(shift)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-400 dark:text-primary-400 font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            Manage
          </button>
        )}
      </div>
    </div>
  );
}
