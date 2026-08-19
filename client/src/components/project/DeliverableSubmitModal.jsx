import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function DeliverableSubmitModal({ isOpen, onClose, onSubmit, deliverable }) {
  const [description, setDescription] = useState('');
  const [fileUrls, setFileUrls] = useState(['']);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !deliverable) return null;

  const nextVersionNumber = deliverable.versions?.length ? deliverable.versions.length + 1 : 1;

  const handleAddUrl = () => setFileUrls([...fileUrls, '']);
  const handleRemoveUrl = (idx) => setFileUrls(fileUrls.filter((_, i) => i !== idx));
  const handleUrlChange = (idx, val) => {
    const next = [...fileUrls];
    next[idx] = val;
    setFileUrls(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanUrls = fileUrls.filter((u) => u.trim().length > 0);
      await onSubmit(deliverable.id, {
        description,
        fileUrls: cleanUrls,
      });
      setDescription('');
      setFileUrls(['']);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-card/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-surface-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-200 pb-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-surface-900">
              Submit Deliverable (v{nextVersionNumber})
            </h3>
            <p className="text-2xs text-surface-600 font-mono">
              Creates an immutable version record: {deliverable.title}
            </p>
          </div>
          <button onClick={onClose} className="text-surface-600 hover:text-surface-900 p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1">
              Submission Notes / Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe work completed in this version submission..."
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-surface-700">
                Deliverable Artifact URLs (GitHub, Supabase File URLs, Figma, Drive)
              </label>
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-2xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-semibold"
              >
                <Plus size={12} /> Add URL
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {fileUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                  />
                  {fileUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(idx)}
                      className="text-surface-500 hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={loading}>
              Submit v{nextVersionNumber}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

