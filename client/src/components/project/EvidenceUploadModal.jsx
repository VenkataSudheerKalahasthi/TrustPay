import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function EvidenceUploadModal({ isOpen, onClose, onSubmit, milestones = [], deliverables = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceType, setEvidenceType] = useState('DOCUMENT');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [milestoneId, setMilestoneId] = useState('');
  const [deliverableId, setDeliverableId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        evidenceType,
        fileUrl,
        fileName: fileName || title,
        fileSize: fileSize ? parseInt(fileSize, 10) : null,
        mimeType: mimeType || null,
        sha256Hash: sha256Hash || null,
        milestoneId: milestoneId || null,
        deliverableId: deliverableId || null,
      });
      setTitle('');
      setDescription('');
      setFileUrl('');
      setFileName('');
      setFileSize('');
      setMimeType('');
      setSha256Hash('');
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-surface-100">Upload Cryptographic Evidence</h3>
            <p className="text-2xs text-surface-400">Stores SHA-256 integrity hash & metadata</p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              Evidence Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit Test Execution Report"
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Type
              </label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="DOCUMENT">Document</option>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF Report</option>
                <option value="ZIP">ZIP Archive</option>
                <option value="LINK">External Link</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                File Name *
              </label>
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="report.pdf"
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              File / Resource URL *
            </label>
            <input
              type="url"
              required
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://supabase-storage.../evidence.pdf"
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1">
              SHA-256 Cryptographic Hash (Optional / Auto-Logged)
            </label>
            <input
              type="text"
              value={sha256Hash}
              onChange={(e) => setSha256Hash(e.target.value)}
              placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
              className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs font-mono text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Link to Milestone
              </label>
              <select
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="">None</option>
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Link to Deliverable
              </label>
              <select
                value={deliverableId}
                onChange={(e) => setDeliverableId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value="">None</option>
                {deliverables.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={loading}>
              Upload Evidence
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
