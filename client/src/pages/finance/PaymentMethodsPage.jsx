import { useState, useEffect } from 'react';
import { financeService } from '@services/finance.service';
import { PaymentMethodCard } from '@components/finance/PaymentMethodCard';
import { CreditCard, Plus } from 'lucide-react';

export function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const profile = await financeService.getBillingProfile();
      setMethods(profile?.paymentMethods || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleAddPaymentMethod = async () => {
    try {
      await financeService.addPaymentMethod({
        type: 'CARD',
        provider: 'RAZORPAY',
        accountLast4: '8899',
        isDefault: methods.length === 0,
      });
      fetchMethods();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Payment Methods Ledger
          </h1>
          <p className="text-slate-400 text-sm">Save payment methods for automated subscription billing and escrow funding</p>
        </div>

        <button
          onClick={handleAddPaymentMethod}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <CreditCard className="w-10 h-10 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No payment methods configured</p>
          </div>
        ) : (
          methods.map((method) => <PaymentMethodCard key={method.id} method={method} />)
        )}
      </div>
    </div>
  );
}
