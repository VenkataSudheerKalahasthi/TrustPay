import { useState } from 'react';
import { Button } from '@components/ui/Button';
import { collaborationService } from '@services/collaboration.service';
import { X, Send, DollarSign, Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react';

export function CollaborationRequestModal({ worker, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    budget: '',
    estimatedDuration: '2 Weeks',
    expectedStartDate: '',
    deadline: '',
    additionalNotes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !worker) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.projectTitle || !formData.projectDescription || !formData.budget) {
      setError('Please fill in the project title, description, and budget.');
      return;
    }

    try {
      setIsLoading(true);
      await collaborationService.requestCollaboration({
        workerProfileId: worker.id || worker.userId,
        ...formData,
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const workerUser = worker.user || {};
  const workerName = `${workerUser.firstName || ''} ${workerUser.lastName || ''}`.trim() || 'Selected Specialist';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-900 border border-surface-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-glow flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-surface-800 flex items-center justify-between bg-surface-950/60">
          <div>
            <h2 className="text-lg font-bold font-display text-surface-50 flex items-center gap-2">
              <Send size={18} className="text-primary-400" />
              Request Collaboration
            </h2>
            <p className="text-xs text-surface-400 mt-0.5">
              Target Specialist: <span className="text-primary-300 font-semibold">{workerName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-surface-50 font-display">Collaboration Request Sent!</h3>
              <p className="text-xs text-surface-300 max-w-sm">
                Request successfully dispatched to {workerName}'s account. You will be notified as soon as they respond.
              </p>
            </div>
          ) : (
            <form id="collab-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Project Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200">
                  Project Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  placeholder="e.g. Enterprise Mobile Wallet UI & Escrow Integration"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>

              {/* Project Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200">
                  Project Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your requirements, scope, deliverables, and technical expectations..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  required
                />
              </div>

              {/* Budget & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-surface-200 flex items-center gap-1">
                    <DollarSign size={14} className="text-primary-400" />
                    Proposed Budget (INR ₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-surface-200 flex items-center gap-1">
                    <Clock size={14} className="text-primary-400" />
                    Estimated Duration
                  </label>
                  <select
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3+ Months">3+ Months</option>
                  </select>
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-surface-200 flex items-center gap-1">
                    <Calendar size={14} className="text-primary-400" />
                    Expected Start Date
                  </label>
                  <input
                    type="date"
                    name="expectedStartDate"
                    value={formData.expectedStartDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-surface-200 flex items-center gap-1">
                    <Calendar size={14} className="text-primary-400" />
                    Project Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200 flex items-center gap-1">
                  <FileText size={14} className="text-primary-400" />
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any specific tools, NDA, or milestones requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!isSuccess && (
          <div className="p-4 border-t border-surface-800 bg-surface-950/80 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="collab-form"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              leftIcon={<Send size={14} />}
            >
              Send Collaboration Request
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
