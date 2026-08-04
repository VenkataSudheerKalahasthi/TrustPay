import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contractService } from '@services/contract.service';
import { PageLoader } from '@components/error/PageLoader';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export function ContractVersionHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <PageLoader />;
  if (!contract) return null;

  const versions = contract.versions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-100 font-display">
            Contract Version History
          </h1>
          <p className="text-xs text-surface-400">
            Historical audit log of all contract revisions for {contract.contractNumber}.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {versions.map((ver) => {
          const creatorName = ver.createdByUser
            ? `${ver.createdByUser.firstName} ${ver.createdByUser.lastName}`
            : 'System';
          const dateStr = ver.createdAt
            ? new Date(ver.createdAt).toLocaleString('en-IN')
            : '';

          return (
            <div key={ver.id} className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-surface-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-400 font-mono text-xs font-bold border border-primary-500/20">
                    Version v{ver.versionNumber}
                  </span>
                  <h3 className="font-bold text-sm text-surface-100 font-display">{ver.title}</h3>
                </div>

                <div className="flex items-center gap-3 text-2xs text-surface-400 font-mono">
                  <div className="flex items-center gap-1">
                    <User size={12} className="text-surface-500" />
                    <span>{creatorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-surface-500" />
                    <span>{dateStr}</span>
                  </div>
                </div>
              </div>

              {ver.changeSummary && (
                <div className="bg-surface-900/60 p-3 rounded-xl border border-surface-800/60 text-xs">
                  <span className="text-surface-400 font-semibold block mb-1">Change Summary:</span>
                  <span className="text-surface-200">{ver.changeSummary}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-surface-300">
                <div>
                  <span className="text-surface-500 font-semibold block">Scope Snapshot:</span>
                  <p className="line-clamp-2 text-2xs text-surface-400">{ver.scopeOfWork}</p>
                </div>
                <div>
                  <span className="text-surface-500 font-semibold block">Deliverables Snapshot:</span>
                  <p className="line-clamp-2 text-2xs text-surface-400">{ver.deliverables}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
