import { useState } from 'react';
import { X, Layers, Play } from 'lucide-react';
import { adminService } from '@services/admin.service';

export function BulkOperationModal({ isOpen, onClose, onSuccess }) {
  const [operationType, setOperationType] = useState('SUSPEND_USERS');
  const [targetUserIdsStr, setTargetUserIdsStr] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const targetUserIds = targetUserIdsStr.split(',').map((s) => s.trim()).filter(Boolean);
      await adminService.executeBulkOperation({ operationType, targetUserIds });
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
            <Layers className="w-5 h-5 text-sky-400" />
            Dispatch Bulk Operation
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Operation Type</label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="SUSPEND_USERS">Bulk Suspend Users</option>
              <option value="RESTORE_USERS">Bulk Restore Users</option>
              <option value="VERIFY_USERS">Bulk Verify Identity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target User IDs (Comma Separated)</label>
            <textarea
              rows={3}
              required
              placeholder="usr_1, usr_2, usr_3..."
              value={targetUserIdsStr}
              onChange={(e) => setTargetUserIdsStr(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
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
              <Play className="w-4 h-4" />
              Dispatch Operation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
