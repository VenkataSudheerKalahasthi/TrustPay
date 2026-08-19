import { useState, useEffect } from 'react';
import { workforceService } from '@services/workforce.service';
import { LeaveRequestModal } from '@components/workforce/LeaveRequestModal';
import { Calendar, Plus, Check, X } from 'lucide-react';

export function LeaveManagementPage() {
  const [requests, setRequests] = useState([]);
  const [balance, setBalance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [reqs, bal] = await Promise.all([
        workforceService.getLeaveRequests().catch(() => []),
        workforceService.getLeaveBalance().catch(() => null),
      ]);
      setRequests(reqs);
      setBalance(bal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await workforceService.reviewLeaveRequest(id, { status });
      fetchLeaveData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Leave Management & Time Off
          </h1>
          <p className="text-slate-400 text-sm">Request vacation/sick leave, view annual balances, and process approvals</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      {/* Balance Summary Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-opacity ${loading ? 'opacity-50' : ''}`}>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Allowance</span>
          <h3 className="text-2xl font-black text-white mt-1">{balance?.totalAllowance || 20} Days</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase">Used Days</span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">{balance?.usedDays || 0} Days</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pending Days</span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">{balance?.pendingDays || 0} Days</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase">Remaining Balance</span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">{balance?.remainingDays || 20} Days</h3>
        </div>
      </div>

      {/* Requests Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Leave Requests Ledger</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
            <tr>
              <th className="py-3.5 px-4">Worker</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Dates</th>
              <th className="py-3.5 px-4">Days</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                  No leave requests submitted
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {req.workerUser?.firstName} {req.workerUser?.lastName}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-bold text-sky-400 dark:text-primary-400">{req.leaveType}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{req.totalDays}d</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {req.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReview(req.id, 'APPROVED')}
                          className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReview(req.id, 'REJECTED')}
                          className="p-1.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <LeaveRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchLeaveData} />
    </div>
  );
}
