import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { contractService } from '@services/contract.service';
import { useAuth } from '@hooks/useAuth';
import { ContractStatusBadge } from '@components/contract/ContractStatusBadge';
import { SignatureCard } from '@components/contract/SignatureCard';
import { ContractTimeline } from '@components/contract/ContractTimeline';
import { Button } from '@components/ui/Button';
import { PageLoader } from '@components/error/PageLoader';
import { NotFound } from '@components/error/NotFound';
import { useToast } from '@hooks/useToast';
import {
  ArrowLeft,
  Download,
  Edit,
  History,
  ShieldCheck,
  XCircle,
  FileText,
} from 'lucide-react';

export function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_isSigning, setIsSigning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchContract = async () => {
    setIsLoading(true);
    try {
      const data = await contractService.getContractById(id);
      setContract(data);
    } catch {
      setContract(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async () => {
    setIsSigning(true);
    try {
      await contractService.signContract(id);
      toast.success('Digitally signed contract successfully!');
      fetchContract();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sign contract');
    } finally {
      setIsSigning(false);
    }
  };

  const handleStatusUpdate = async (status, reason) => {
    try {
      await contractService.updateStatus(id, status, reason);
      toast.success(`Contract status updated to ${status}`);
      fetchContract();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update contract status');
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await contractService.downloadPdf(id);
      toast.success('Downloaded contract PDF!');
    } catch {
      toast.error('Failed to download contract PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (!contract) return <NotFound message="Contract document not found" />;

  const clientUser = contract.clientProfile?.user || {};
  const workerUser = contract.workerProfile?.user || {};
  const clientName = `${clientUser.firstName || ''} ${clientUser.lastName || ''}`.trim() || 'Client';
  const workerName = `${workerUser.firstName || ''} ${workerUser.lastName || ''}`.trim() || 'Worker';

  const clientSig = contract.signatures?.find((s) => s.signerRole === 'CLIENT');
  const workerSig = contract.signatures?.find((s) => s.signerRole === 'WORKER');

  const isClientUser = clientUser.id === user?.id;
  const isWorkerUser = workerUser.id === user?.id;
  const isImmutable = contract.status === 'ACCEPTED' || contract.status === 'ARCHIVED';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-card border border-surface-200 text-surface-600 hover:text-surface-900 shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                {contract.contractNumber}
              </span>
              <ContractStatusBadge status={contract.status} />
              <span className="text-2xs font-mono text-surface-500">
                v{contract.currentVersionNumber || 1}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-surface-900 font-display mt-1">
              {contract.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            isLoading={isDownloading}
            onClick={handleDownloadPdf}
            leftIcon={<Download size={14} />}
          >
            Download PDF
          </Button>

          <Link to={`/contracts/${id}/versions`}>
            <Button variant="outline" size="sm" leftIcon={<History size={14} />}>
              History
            </Button>
          </Link>

          {!isImmutable && (
            <Link to={`/contracts/${id}/edit`}>
              <Button variant="secondary" size="sm" leftIcon={<Edit size={14} />}>
                Edit
              </Button>
            </Link>
          )}

          {contract.status === 'PENDING_ACCEPTANCE' && isWorkerUser && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleStatusUpdate('REJECTED', 'Worker rejected terms')}
              leftIcon={<XCircle size={14} />}
            >
              Reject
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contract Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Details */}
          <div className="glass-card p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-surface-600 uppercase tracking-wider mb-2">
                Scope of Work
              </h3>
              <p className="text-xs text-surface-700 leading-relaxed whitespace-pre-line bg-surface-50 p-4 rounded-xl border border-surface-200">
                {contract.scopeOfWork}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-surface-600 uppercase tracking-wider mb-2">
                Deliverables & Milestones
              </h3>
              <p className="text-xs text-surface-700 leading-relaxed whitespace-pre-line bg-surface-50 p-4 rounded-xl border border-surface-200">
                {contract.deliverables}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-surface-600 uppercase tracking-wider mb-2">
                Terms & Conditions
              </h3>
              <p className="text-xs text-surface-700 leading-relaxed whitespace-pre-line bg-surface-50 p-4 rounded-xl border border-surface-200">
                {contract.termsAndConditions}
              </p>
            </div>

            {contract.paymentTermsText && (
              <div>
                <h3 className="text-xs font-bold text-surface-600 uppercase tracking-wider mb-2">
                  Payment Terms
                </h3>
                <p className="text-xs text-primary-700 bg-primary-50 p-3 rounded-xl border border-primary-100">
                  {contract.paymentTermsText}
                </p>
              </div>
            )}
          </div>

          {/* Digital Signatures Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-600" />
              <span>Digital Signatures</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SignatureCard
                title={`Client: ${clientName}`}
                role="CLIENT"
                signature={clientSig}
                onSign={handleSign}
                isCurrentSigner={isClientUser && (!clientSig || clientSig.signatureStatus !== 'SIGNED')}
              />

              <SignatureCard
                title={`Specialist: ${workerName}`}
                role="WORKER"
                signature={workerSig}
                onSign={handleSign}
                isCurrentSigner={isWorkerUser && (!workerSig || workerSig.signatureStatus !== 'SIGNED')}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Activity Timeline & Integrity Hashes */}
        <div className="space-y-6">
          {/* Cryptographic Integrity Card */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-surface-900 flex items-center gap-1.5">
              <FileText size={14} className="text-primary-600" />
              <span>Cryptographic Audit Hashes</span>
            </h3>

            <div className="space-y-2 text-2xs font-mono">
              <div>
                <span className="text-surface-600 block">Content Hash (SHA-256):</span>
                <span className="text-surface-500 truncate block">
                  {contract.contentHash || 'N/A'}
                </span>
              </div>
              {contract.pdfHash && (
                <div>
                  <span className="text-surface-600 block">PDF Hash (SHA-256):</span>
                  <span className="text-surface-500 truncate block">{contract.pdfHash}</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-surface-900">Contract Activity Trail</h3>
            <ContractTimeline activities={contract.activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
