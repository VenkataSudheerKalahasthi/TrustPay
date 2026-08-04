import { useState, useEffect } from 'react';
import { workforceService } from '@services/workforce.service';
import { AttendanceBadge } from '@components/workforce/AttendanceBadge';
import { UserCheck } from 'lucide-react';

export function AttendancePage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    workforceService
      .getAttendanceRecords()
      .then((data) => setRecords(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-sky-400" />
          Attendance & Clock History
        </h1>
        <p className="text-slate-400 text-sm">Monitor check-ins, check-outs, remote status, and shift attendance</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Worker</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Check In</th>
              <th className="py-3.5 px-4">Check Out</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                  No attendance records logged
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {rec.workerUser?.firstName} {rec.workerUser?.lastName}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                    {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                    {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <AttendanceBadge status={rec.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
