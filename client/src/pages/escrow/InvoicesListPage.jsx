import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { escrowService } from '@services/escrow.service';
import { PageLoader } from '@components/error/PageLoader';
import { ArrowLeft, Download, ArrowUpRight } from 'lucide-react';

export function InvoicesListPage() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await escrowService.searchInvoices({ limit: 50 });
      setInvoices(res.invoices || []);
    } catch {
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = (id) => {
    escrowService.downloadInvoicePdf(id);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-card border border-surface-200 text-surface-600 hover:text-surface-900"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Tax Invoices
          </h1>
          <p className="text-xs text-surface-600">
            Digital contract & escrow deposit PDF tax invoice documents.
          </p>
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : invoices.length === 0 ? (
        <div className="glass-card p-12 text-center text-xs text-surface-600">
          No tax invoices generated yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="glass-card p-5 flex flex-col justify-between hover:border-surface-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xs font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-2xs text-surface-500 font-mono">
                    v{inv.versionNumber || 1}
                  </span>
                </div>

                <div className="text-xl font-bold text-surface-900 font-display mb-1">
                  ₹{(inv.totalAmount || inv.amount).toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-surface-600 line-clamp-2 mb-4">
                  {inv.paymentDetailsText || 'Escrow payment invoice'}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(inv.id)}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline font-semibold"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>

                <Link
                  to={`/invoices/${inv.id}`}
                  className="inline-flex items-center gap-1 text-2xs text-surface-600 hover:text-surface-900"
                >
                  <span>Details</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

