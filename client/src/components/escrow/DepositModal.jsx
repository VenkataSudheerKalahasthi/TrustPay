import { useState } from 'react';
import { escrowService } from '@services/escrow.service';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useToast } from '@hooks/useToast';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

export function DepositModal({ isOpen, onClose, onSuccess }) {
  const toast = useToast();

  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 100) {
      toast.error('Minimum deposit amount is ₹100');
      return;
    }

    setIsSubmitting(true);
    const idempotencyKey = `dep_key_${Date.now()}_${Math.random()}`;

    try {
      // 1. Create Order
      const res = await escrowService.createDepositOrder(numAmount, null, idempotencyKey);
      const order = res.razorpayOrder;

      // 2. Mock / Razorpay Checkout Trigger
      toast.info('Simulating Secure Razorpay Checkout Verification...');

      setTimeout(async () => {
        try {
          const verifyRes = await escrowService.verifyPayment(
            {
              razorpayOrderId: order.id,
              razorpayPaymentId: `pay_${Date.now()}`,
              razorpaySignature: `mock_sig_${Date.now()}`,
            },
            idempotencyKey
          );

          toast.success(`Successfully deposited ₹${numAmount} into Escrow Wallet!`);
          onSuccess && onSuccess(verifyRes);
          onClose();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Payment verification failed');
        } finally {
          setIsSubmitting(false);
        }
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize deposit order');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-card max-w-md w-full p-6 space-y-6 relative border border-surface-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-primary-400" />
            <h3 className="text-base font-bold text-surface-100 font-display">
              Deposit Funds to Wallet
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

        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <Input
            type="number"
            label="Deposit Amount (INR) *"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
            required
          />

          <div className="bg-surface-900/60 p-3 rounded-xl border border-surface-800 text-2xs text-surface-400 space-y-1">
            <div className="flex items-center gap-1 text-surface-300 font-semibold">
              <ShieldCheck size={12} className="text-primary-400" />
              <span>Razorpay Encrypted Gateway</span>
            </div>
            <p>Funds will be instantly added to your Escrow Available Balance.</p>
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<CreditCard size={16} />}
            >
              Pay via Razorpay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
