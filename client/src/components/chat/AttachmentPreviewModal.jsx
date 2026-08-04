import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function AttachmentPreviewModal({ isOpen, onClose, attachment }) {
  if (!isOpen || !attachment) return null;

  const isImage = attachment.mimeType?.startsWith('image/') || attachment.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  return (
    <div className="fixed inset-0 z-modal bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4">
          <div className="truncate">
            <h3 className="text-base font-semibold text-surface-100 truncate">{attachment.fileName}</h3>
            <p className="text-2xs text-surface-400 font-mono">{attachment.mimeType || 'Attachment'}</p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Media / File View */}
        <div className="mb-4">
          {isImage ? (
            <img
              src={attachment.fileUrl}
              alt={attachment.fileName}
              className="max-h-72 w-full object-contain rounded-xl bg-surface-950"
            />
          ) : (
            <div className="p-8 text-center rounded-xl bg-surface-950 border border-surface-800">
              <p className="text-xs text-surface-300 font-mono mb-2">{attachment.fileName}</p>
            </div>
          )}
        </div>

        {/* Cryptographic SHA-256 Metadata */}
        {attachment.sha256Hash && (
          <div className="p-3 rounded-xl bg-surface-950 border border-surface-800 font-mono text-2xs mb-4">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
              <ShieldCheck size={12} />
              <span>SHA-256 Integrity Verification:</span>
            </div>
            <span className="text-surface-300 break-all">{attachment.sha256Hash}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" leftIcon={<ExternalLink size={14} />}>
              Download Attachment
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
