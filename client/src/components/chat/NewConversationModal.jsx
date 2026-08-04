import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function NewConversationModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [type, setType] = useState('DIRECT');
  const [title, setTitle] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [contractId, setContractId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      title: title || undefined,
      participantUserIds: [recipientEmail],
      projectId: projectId || undefined,
      contractId: contractId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-modal bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4">
          <h3 className="text-base font-semibold text-surface-100">Start New Conversation</h3>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">Conversation Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            >
              <option value="DIRECT">Direct Message (1-on-1)</option>
              <option value="PROJECT">Project Discussion</option>
              <option value="GROUP">Group Discussion</option>
            </select>
          </div>

          {type !== 'DIRECT' && (
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Group / Discussion title..."
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">Recipient User ID or Email *</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter user ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Project ID (Optional)</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="PRJ ID..."
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">Contract ID (Optional)</label>
              <input
                type="text"
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                placeholder="CTR ID..."
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isSubmitting}>
              Initialize Chat
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
