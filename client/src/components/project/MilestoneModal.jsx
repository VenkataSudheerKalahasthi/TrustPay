import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function MilestoneModal({ isOpen, onClose, onSubmit, existingMilestones = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [prerequisiteMilestoneId, setPrerequisiteMilestoneId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        dueDate: dueDate || null,
        estimatedAmount: estimatedAmount ? parseFloat(estimatedAmount) : null,
        prerequisiteMilestoneId: prerequisiteMilestoneId || null,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setEstimatedAmount('');
      setPrerequisiteMilestoneId('');
      onClose();
    } catch {
      // Error handled by parent toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4">
          <h3 className="text-base font-semibold text-surface-100">Add Project Milestone</h3>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Initial Backend API Setup"
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope and details for this milestone..."
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Estimated Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={estimatedAmount}
                onChange={(e) => setEstimatedAmount(e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              Prerequisite Milestone (Dependency)
            </label>
            <select
              value={prerequisiteMilestoneId}
              onChange={(e) => setPrerequisiteMilestoneId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            >
              <option value="">None (Independent Milestone)</option>
              {existingMilestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.status})
                </option>
              ))}
            </select>
            <p className="text-2xs text-surface-500 mt-1">
              If selected, this milestone cannot be completed until the prerequisite is completed.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={loading}>
              Create Milestone
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
