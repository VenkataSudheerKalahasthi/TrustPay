import { useState } from 'react';
import { X, AlertOctagon, Send } from 'lucide-react';
import { supportService } from '@services/support.service';

export function CreateDisputeModal({ isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [amountDisputed, setAmountDisputed] = useState(0);
  const [contractId, setContractId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await supportService.createDispute({
        reason,
        amountDisputed: Number(amountDisputed),
        contractId: contractId || null,
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            Open Dispute Case
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contract ID (Optional)</label>
            <input
              type="text"
              placeholder="e.g. cnt_sample_001"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Disputed Amount (INR ₹)</label>
            <input
              type="number"
              min="0"
              value={amountDisputed}
              onChange={(e) => setAmountDisputed(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Dispute</label>
            <textarea
              rows={4}
              required
              placeholder="State clear reasons and milestone deliverable evidence..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
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
              className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Open Dispute Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
