import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to perform this action? This step cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className="p-3 rounded-2xl bg-danger-500/15 border border-danger-500/30 text-danger-400 mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-surface-100 font-display">{title}</h3>
        <p className="text-xs text-surface-400 mt-1.5 leading-relaxed">{description}</p>

        <div className="flex items-center justify-center gap-3 w-full mt-6">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading} fullWidth>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={onConfirm}
            loading={isLoading}
            fullWidth
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
