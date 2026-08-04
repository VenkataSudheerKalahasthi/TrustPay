import { useState } from 'react';
import { escrowService } from '@services/escrow.service';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useToast } from '@hooks/useToast';
import { X, CheckCircle2 } from 'lucide-react';

export function ReleaseModal({ isOpen, contract, availableBalance, onClose, onSuccess }) {
  const toast = useToast();

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !contract) return null;

  const handleReleaseSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Release amount must be greater than 0');
      return;
    }
    if (numAmount > availableBalance) {
      toast.error(`Release amount exceeds available balance (₹${availableBalance})`);
      return;
    }

    setIsSubmitting(true);
    const idempotencyKey = `rel_key_${Date.now()}_${Math.random()}`;

    try {
      const res = await escrowService.releaseFunds(
        {
          contractId: contract.id,
          workerProfileId: contract.workerProfileId,
          amount: numAmount,
          notes,
        },
        idempotencyKey
      );

      toast.success(`Successfully released ₹${numAmount} to specialist!`);
      onSuccess && onSuccess(res);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release escrow funds');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-card max-w-md w-full p-6 space-y-6 relative border border-surface-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-success-400" />
            <h3 className="text-base font-bold text-surface-100 font-display">
              Release Escrow Funds
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-surface-400 hover:text-surface-100"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleReleaseSubmit} className="space-y-4">
          <div className="text-xs text-surface-400 bg-surface-900/60 p-3 rounded-xl border border-surface-800">
            Contract: <span className="text-surface-200 font-semibold">{contract.title}</span> (
            {contract.contractNumber})
          </div>

          <Input
            type="number"
            label="Release Amount (INR) *"
            placeholder="e.g. 25000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={availableBalance}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">
              Release Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Milestone 1 deliverables approved."
              className="w-full bg-surface-900 border border-surface-800 rounded-xl p-3 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 size={16} />}
            >
              Confirm Release
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
