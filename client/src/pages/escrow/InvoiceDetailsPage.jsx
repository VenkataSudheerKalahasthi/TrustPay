import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { escrowService } from '@services/escrow.service';
import { Button } from '@components/ui/Button';
import { PageLoader } from '@components/error/PageLoader';
import { ArrowLeft, Download } from 'lucide-react';

export function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoicePreview();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInvoicePreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/escrow/invoices/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch {
      setPdfUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (id) escrowService.downloadInvoicePdf(id);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-full flex flex-col space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-card border border-surface-200 text-surface-600 hover:text-surface-900"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-surface-900 font-display">
              Tax Invoice Document Preview
            </h1>
            <p className="text-xs text-surface-600">PDF invoice document generated for escrow payment.</p>
          </div>
        </div>

        <Button size="sm" onClick={handleDownload} leftIcon={<Download size={14} />}>
          Download PDF
        </Button>
      </div>

      <div className="flex-1 glass-card p-2 min-h-[600px] overflow-hidden">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Invoice PDF Preview"
            className="w-full h-full min-h-[600px] rounded-xl"
          />
        ) : (
          <div className="text-center py-12 text-surface-600 text-xs">
            Unable to load PDF preview. Use the download button to view offline.
          </div>
        )}
      </div>
    </div>
  );
}

