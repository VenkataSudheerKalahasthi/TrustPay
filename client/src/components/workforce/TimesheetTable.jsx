import { Check, X, FileText } from 'lucide-react';

export function TimesheetTable({ timesheets = [], onReview, isManager = false }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400 dark:text-primary-400" />
            Timesheet Ledger
          </h3>
          <p className="text-xs text-slate-400">Weekly & biweekly worker time logs and approvals</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Worker</th>
              <th className="py-3.5 px-4">Period</th>
              <th className="py-3.5 px-4">Total Hours</th>
              <th className="py-3.5 px-4">Billable</th>
              <th className="py-3.5 px-4">Overtime</th>
              <th className="py-3.5 px-4">Status</th>
              {isManager && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {timesheets.length === 0 ? (
              <tr>
                <td colSpan={isManager ? 7 : 6} className="py-8 text-center text-slate-500 font-medium">
                  No timesheets recorded
                </td>
              </tr>
            ) : (
              timesheets.map((ts) => (
                <tr key={ts.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {ts.workerUser?.firstName} {ts.workerUser?.lastName}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {new Date(ts.startDate).toLocaleDateString()} - {new Date(ts.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{ts.totalHours}h</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-medium">{ts.billableHours}h</td>
                  <td className="py-3.5 px-4 text-amber-400 font-medium">{ts.overtimeHours}h</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        ts.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : ts.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {ts.status}
                    </span>
                  </td>
                  {isManager && (
                    <td className="py-3.5 px-4 text-right">
                      {ts.status === 'SUBMITTED' && onReview && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onReview(ts.id, 'APPROVED')}
                            className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onReview(ts.id, 'REJECTED')}
                            className="p-1.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
