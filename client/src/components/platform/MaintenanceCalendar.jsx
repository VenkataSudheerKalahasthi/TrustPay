import { Calendar } from 'lucide-react';

export function MaintenanceCalendar({ schedules = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Calendar className="w-5 h-5 text-sky-400" />
        Maintenance Window Schedule
      </h3>

      <div className="space-y-3 pt-2 border-t border-slate-800">
        {schedules.length === 0 ? (
          <p className="text-slate-500 text-center py-6 text-xs">No active maintenance windows scheduled</p>
        ) : (
          schedules.map((sch) => (
            <div key={sch.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400 uppercase">{sch.type}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{sch.title}</h4>
                <p className="text-xs text-slate-400">{sch.description}</p>
              </div>

              <div className="text-right text-xs font-mono text-slate-300">
                <span>Start: {new Date(sch.startTime).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
