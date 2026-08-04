import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function DeliverableReviewModal({ isOpen, onClose, onSubmit, deliverable, targetStatus }) {
  const [clientFeedback, setClientFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !deliverable) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(deliverable.id, {
        status: targetStatus,
        clientFeedback,
      });
      setClientFeedback('');
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const statusTitle =
    targetStatus === 'APPROVED'
      ? 'Approve Deliverable'
      : targetStatus === 'REVISION_REQUESTED'
      ? 'Request Revision'
      : 'Reject Deliverable';

  return (
    <div className="fixed inset-0 z-modal bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-surface-100">{statusTitle}</h3>
            <p className="text-2xs text-surface-400 font-mono">{deliverable.title}</p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              Client Review Comments / Feedback *
            </label>
            <textarea
              rows={4}
              required
              value={clientFeedback}
              onChange={(e) => setClientFeedback(e.target.value)}
              placeholder={
                targetStatus === 'APPROVED'
                  ? 'Acceptance notes for approval...'
                  : 'Specify details and requirements for revision...'
              }
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant={
                targetStatus === 'APPROVED'
                  ? 'success'
                  : targetStatus === 'REVISION_REQUESTED'
                  ? 'warning'
                  : 'danger'
              }
              loading={loading}
            >
              Confirm {targetStatus}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
