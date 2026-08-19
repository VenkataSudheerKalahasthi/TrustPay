import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contractService } from '@services/contract.service';
import { ContractStatusBadge } from '@components/contract/ContractStatusBadge';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { PageLoader } from '@components/error/PageLoader';
import { Plus, Search, FileText, ArrowUpRight, Calendar } from 'lucide-react';

export function ContractsListPage() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const res = await contractService.searchContracts({
        q: searchQuery,
        status: statusFilter || undefined,
      });
      setContracts(res.contracts || []);
    } catch {
      setContracts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContracts();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Digital Contracts
          </h1>
          <p className="text-xs text-surface-600">
            Manage your service agreements, versioning, digital signatures & milestones.
          </p>
        </div>

        <Link to="/contracts/create">
          <Button leftIcon={<Plus size={16} />}>Create Contract</Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search by contract #, title or scope..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <Search size={16} className="absolute left-3 top-3 text-surface-500" />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 bg-card border border-surface-200 rounded-xl px-3 py-2 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING_ACCEPTANCE">Pending Acceptance</option>
          <option value="ACCEPTED">Accepted & Active</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Contracts Table / List */}
      {isLoading ? (
        <PageLoader />
      ) : contracts.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <FileText size={40} className="mx-auto text-surface-500" />
          <h3 className="text-base font-bold text-surface-900">No contracts found</h3>
          <p className="text-xs text-surface-500 max-w-sm mx-auto">
            You don't have any digital contracts matching your filter criteria. Create a new contract to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts.map((cnt) => {
            const clientName = cnt.clientProfile?.user
              ? `${cnt.clientProfile.user.firstName} ${cnt.clientProfile.user.lastName}`
              : 'Client';
            const workerName = cnt.workerProfile?.user
              ? `${cnt.workerProfile.user.firstName} ${cnt.workerProfile.user.lastName}`
              : 'Worker';

            return (
              <div
                key={cnt.id}
                className="glass-card p-5 flex flex-col justify-between hover:border-surface-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xs font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                      {cnt.contractNumber}
                    </span>
                    <ContractStatusBadge status={cnt.status} />
                  </div>

                  <h3 className="text-sm font-bold text-surface-900 font-display line-clamp-1 mb-1">
                    {cnt.title}
                  </h3>

                  <p className="text-xs text-surface-600 line-clamp-2 mb-4 leading-relaxed">
                    {cnt.scopeOfWork}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-200 space-y-2">
                  <div className="flex items-center justify-between text-2xs text-surface-500">
                    <span>Parties:</span>
                    <span className="font-semibold text-surface-900">
                      {clientName} & {workerName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-2xs text-surface-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-surface-600" />
                      <span>v{cnt.currentVersionNumber || 1}</span>
                    </div>
                    <Link
                      to={`/contracts/${cnt.id}`}
                      className="inline-flex items-center gap-1 text-primary-600 hover:underline font-semibold"
                    >
                      <span>View Details</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

