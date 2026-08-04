import { useState } from 'react';
import { X, ShieldAlert, Send } from 'lucide-react';
import { adminService } from '@services/admin.service';

export function RestrictionModal({ isOpen, user, onClose, onSuccess }) {
  const [type, setType] = useState('LIMITED_ACCESS');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.restrictUser({
        targetUserId: user.id,
        type,
        reason,
      });
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Impose User Restriction
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Target User</span>
            <div className="p-3 bg-slate-800/60 rounded-xl text-sm font-bold text-white">
              {user.firstName} {user.lastName} ({user.email})
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Restriction Level</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="WARNING">WARNING – Informal Alert</option>
              <option value="LIMITED_ACCESS">LIMITED_ACCESS – Restrict Withdrawals/Bidding</option>
              <option value="SUSPENDED">SUSPENDED – Temporary Account Lock</option>
              <option value="BANNED">BANNED – Permanent Platform Exclusion</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Restriction</label>
            <textarea
              rows={3}
              required
              placeholder="State clear compliance or security grounds..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-sky-500"
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
              className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-amber-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Apply Restriction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
