import { useState } from 'react';
import { X, GitCommit, Send } from 'lucide-react';
import { platformService } from '@services/platform.service';

export function CreateReleaseModal({ isOpen, onClose, onSuccess }) {
  const [version, setVersion] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const ver = await platformService.createVersion({
        version,
        buildNumber,
        isCurrent: true,
      });

      if (content) {
        await platformService.addReleaseNote({
          applicationVersionId: ver.id,
          title: `Release Notes v${version}`,
          category: 'FEATURE',
          content,
        });
      }

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
            <GitCommit className="w-5 h-5 text-sky-400" />
            Publish Application Release
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Version</label>
              <input
                type="text"
                required
                placeholder="e.g. 2.1.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Build Number</label>
              <input
                type="text"
                required
                placeholder="e.g. BUILD-20260803"
                value={buildNumber}
                onChange={(e) => setBuildNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Release Note Content</label>
            <textarea
              rows={3}
              required
              placeholder="Describe release highlights..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
              Publish Release
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
