import { X, ExternalLink, Calendar, User } from 'lucide-react';
import { Badge } from '@components/ui/Badge';

export function DeliverableHistoryModal({ isOpen, onClose, deliverable }) {
  if (!isOpen || !deliverable) return null;

  const versions = deliverable.versions || [];

  return (
    <div className="fixed inset-0 z-modal bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-surface-100">
              Immutable Version History
            </h3>
            <p className="text-xs text-surface-400 font-mono">{deliverable.title}</p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {versions.length === 0 ? (
            <p className="text-xs text-surface-500 text-center py-6">No versions submitted yet.</p>
          ) : (
            versions.map((ver) => {
              const submitterName = ver.submittedByUser
                ? `${ver.submittedByUser.firstName} ${ver.submittedByUser.lastName}`
                : 'Worker';

              return (
                <div
                  key={ver.id}
                  className="p-4 rounded-xl bg-surface-800/60 border border-surface-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">
                        Version {ver.versionNumber}
                      </span>
                      <Badge size="sm" variant={ver.status === 'APPROVED' ? 'success' : 'neutral'}>
                        {ver.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-2xs text-surface-400">
                      <Calendar size={12} />
                      <span>{new Date(ver.submittedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {ver.description && (
                    <p className="text-xs text-surface-300 leading-relaxed bg-surface-900/40 p-2.5 rounded-lg">
                      {ver.description}
                    </p>
                  )}

                  {ver.fileUrls && ver.fileUrls.length > 0 && (
                    <div>
                      <span className="text-2xs font-semibold text-surface-400 block mb-1">
                        Artifact URLs:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ver.fileUrls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-700/60 text-primary-300 hover:text-primary-200 text-2xs font-mono truncate max-w-xs"
                          >
                            <ExternalLink size={10} />
                            <span className="truncate">{url}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {ver.clientFeedback && (
                    <div className="border-t border-surface-700/40 pt-2 text-xs text-surface-400">
                      <span className="font-semibold text-surface-200 block text-2xs mb-0.5">
                        Client Review Feedback:
                      </span>
                      {ver.clientFeedback}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-2xs text-surface-500 font-mono">
                    <User size={10} />
                    <span>Submitted by: {submitterName}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
