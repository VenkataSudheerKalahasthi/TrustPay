import { X, Calendar, User } from 'lucide-react';

export function MessageHistoryModal({ isOpen, onClose, message }) {
  if (!isOpen || !message) return null;

  const versions = message.versions || [];

  return (
    <div className="fixed inset-0 z-modal bg-card/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-surface-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-surface-200 pb-4 mb-4 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-surface-900">Immutable Message Edit History</h3>
            <p className="text-2xs text-surface-600 font-mono">Message ID: {message.id}</p>
          </div>
          <button onClick={onClose} className="text-surface-600 hover:text-surface-900 p-1">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Current Message */}
          <div className="p-3 rounded-xl bg-primary-50 border border-primary-600/30">
            <div className="flex items-center justify-between text-2xs font-semibold text-primary-600 mb-1">
              <span>Current Live Content (v{message.currentVersion})</span>
              <span>{new Date(message.updatedAt).toLocaleString()}</span>
            </div>
            <p className="text-xs text-surface-900">{message.content}</p>
          </div>

          {/* Previous Versions */}
          {versions.length === 0 ? (
            <p className="text-xs text-surface-500 text-center py-4">No previous edits recorded.</p>
          ) : (
            versions.map((v) => {
              const editorName = v.editedByUser
                ? `${v.editedByUser.firstName} ${v.editedByUser.lastName}`
                : 'User';

              return (
                <div key={v.id} className="p-3 rounded-xl bg-surface-100/60 border border-surface-300/60">
                  <div className="flex items-center justify-between text-2xs text-surface-600 mb-1">
                    <span className="font-mono font-semibold text-surface-700">
                      Version {v.versionNumber}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>{new Date(v.editedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-surface-700 mb-2 leading-relaxed bg-card/40 p-2 rounded-lg">
                    {v.previousContent}
                  </p>

                  <div className="flex items-center justify-between text-2xs text-surface-500 font-mono">
                    <span className="flex items-center gap-1">
                      <User size={10} /> Edited by: {editorName}
                    </span>
                    {v.editReason && <span>Reason: {v.editReason}</span>}
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

