import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function InviteCandidateModal({ isOpen, onClose, onSendInvitation, workerUserId }) {
  const [jobId, setJobId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSendInvitation({ jobId, workerUserId, message });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-card/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-surface-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
            <Send size={16} className="text-primary-600" />
            <span>Invite Candidate to Job Opportunity</span>
          </h3>
          <button onClick={onClose} className="text-surface-600 hover:text-surface-900">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-3xs font-mono text-surface-600 block mb-1">Target Job ID *</label>
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Enter active Job ID..."
              required
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            />
          </div>

          <div>
            <label className="text-3xs font-mono text-surface-600 block mb-1">Personalized Invitation Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Add a custom note to the candidate..."
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            />
          </div>

          <Button size="sm" variant="primary" fullWidth type="submit" isLoading={loading}>
            Send Candidate Invitation
          </Button>
        </form>
      </div>
    </div>
  );
}

