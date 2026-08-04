import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@components/ui/Button';

const ALLOWED_TRANSITIONS = {
  DRAFT: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['ON_HOLD', 'IN_REVIEW', 'CANCELLED'],
  ON_HOLD: ['ACTIVE', 'CANCELLED'],
  IN_REVIEW: ['COMPLETED', 'ACTIVE', 'CANCELLED'],
  COMPLETED: ['ARCHIVED'],
  CANCELLED: ['ARCHIVED'],
  ARCHIVED: [],
};

export function ProjectStatusModal({ isOpen, onClose, onSubmit, currentStatus = 'DRAFT' }) {
  const [targetStatus, setTargetStatus] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetStatus) return;
    setLoading(true);
    try {
      await onSubmit(targetStatus, reason);
      setReason('');
      setTargetStatus('');
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-surface-100">
              Project Lifecycle State Transition
            </h3>
            <p className="text-2xs text-surface-400">Current Status: {currentStatus}</p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              Select Permitted Target State *
            </label>
            <select
              required
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            >
              <option value="">Select Target Status...</option>
              {allowed.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {allowed.length === 0 && (
              <p className="text-2xs text-red-400 mt-1">
                No state transitions are allowed from {currentStatus} (Terminal state).
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              Reason / Status Audit Note
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for state transition..."
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={loading} disabled={!targetStatus}>
              Change State
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
