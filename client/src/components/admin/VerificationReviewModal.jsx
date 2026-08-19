import { useState } from 'react';
import { X, ShieldCheck, Send } from 'lucide-react';
import { adminService } from '@services/admin.service';

export function VerificationReviewModal({ isOpen, review, onClose, onSuccess }) {
  const [status, setStatus] = useState('VERIFIED');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.reviewVerification(review.id, { status, notes });
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
            <ShieldCheck className="w-5 h-5 text-sky-400 dark:text-primary-400" />
            Review Identity Verification
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Target User</span>
            <div className="p-3 bg-slate-800/60 rounded-xl text-sm font-bold text-white">
              {review.targetUser?.firstName} {review.targetUser?.lastName} ({review.targetUser?.email})
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Verification Decision</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="VERIFIED">VERIFIED – Approve Identity Credentials</option>
              <option value="REJECTED">REJECTED – Disapprove Documents</option>
              <option value="PENDING">PENDING – Require Additional Info</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Review Notes</label>
            <textarea
              rows={3}
              placeholder="Compliance notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-sky-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Save Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
