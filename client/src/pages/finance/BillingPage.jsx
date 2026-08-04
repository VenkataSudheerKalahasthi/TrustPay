import { useState, useEffect } from 'react';
import { financeService } from '@services/finance.service';
import { BillingProfileCard } from '@components/finance/BillingProfileCard';
import { FileText, Download } from 'lucide-react';

export function BillingPage() {
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      financeService.getBillingProfile().catch(() => null),
      financeService.getUserSubscription().catch(() => null),
    ])
      .then(([prof, sub]) => {
        setProfile(prof);
        setSubscription(sub);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-sky-400" />
          Enterprise Billing & Invoices
        </h1>
        <p className="text-slate-400 text-sm">Download tax invoices, manage corporate GST billing details, and inspect payment history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BillingProfileCard profile={profile} />
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Invoice Ledger History</h3>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 font-mono">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {subscription?.invoices?.length > 0 ? (
                subscription.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{inv.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    No billing invoices generated yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
