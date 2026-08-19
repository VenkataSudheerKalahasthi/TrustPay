import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FolderPlus, ShieldCheck, Wallet, UserCheck } from 'lucide-react';
import { projectService } from '@services/project.service';
import { contractService } from '@services/contract.service';
import { escrowService } from '@services/escrow.service';
import { workerService } from '@services/worker.service';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');
  const [contractId, setContractId] = useState('');
  const [escrowWalletId, setEscrowWalletId] = useState('');
  const [workerProfileId, setWorkerProfileId] = useState('');
  const [notes, setNotes] = useState('');

  // Dropdown lists
  const [contracts, setContracts] = useState([]);
  const [escrowWallet, setEscrowWallet] = useState(null);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [contractsRes, walletRes, workersRes] = await Promise.allSettled([
          contractService.searchContracts({ limit: 50 }),
          escrowService.getWalletDetails(),
          workerService.searchWorkers({ limit: 50 }),
        ]);

        if (contractsRes.status === 'fulfilled' && contractsRes.value?.contracts) {
          setContracts(contractsRes.value.contracts);
        }
        if (walletRes.status === 'fulfilled' && walletRes.value) {
          setEscrowWallet(walletRes.value);
          setEscrowWalletId(walletRes.value.id);
        }
        if (workersRes.status === 'fulfilled' && workersRes.value?.workers) {
          setWorkers(workersRes.value.workers);
        }
      } catch {
        // Fallbacks handled
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const created = await projectService.createProject({
        title,
        description,
        category: category || null,
        priority,
        estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
        estimatedDuration: estimatedDuration || null,
        startDate: startDate || null,
        targetEndDate: targetEndDate || null,
        contractId: contractId || null,
        escrowWalletId: escrowWalletId || null,
        workerProfileId: workerProfileId || null,
        notes: notes || null,
      });
      navigate(`/projects/${created.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link to="/projects">
          <Button size="xs" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
            Back to Projects
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-surface-900">Create New Execution Project</h1>
        <p className="text-xs text-surface-600">
          Establish operational workflow connecting workers, clients, digital contracts, and escrow wallets.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      <Card className="p-6 bg-card border-surface-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-600 border-b border-surface-200 pb-2">
              1. Project Core Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                Project Name / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Enterprise E-Commerce Platform Build"
                className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                Project Scope & Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed explanation of requirements, goals, and deliverables..."
                className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
              />
            </div>
          </div>

          {/* Integrations */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-600 border-b border-surface-200 pb-2">
              2. Module Integrations (Contract, Escrow, Worker)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" /> Linked Contract
                </label>
                <select
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                >
                  <option value="">None (Independent Project)</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contractNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1 flex items-center gap-1">
                  <Wallet size={14} className="text-indigo-400" /> Linked Escrow Wallet
                </label>
                <input
                  type="text"
                  readOnly
                  value={escrowWallet ? `Escrow Wallet (${escrowWallet.currency} ${escrowWallet.totalBalance})` : 'Active Escrow Wallet'}
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1 flex items-center gap-1">
                  <UserCheck size={14} className="text-primary-600" /> Assigned Worker
                </label>
                <select
                  value={workerProfileId}
                  onChange={(e) => setWorkerProfileId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                >
                  <option value="">Select Assigned Worker...</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.user ? `${w.user.firstName} ${w.user.lastName}` : w.slug}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule & Budget */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-600 border-b border-surface-200 pb-2">
              3. Budget & Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Estimated Budget (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  placeholder="150000"
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="e.g. 6 Weeks"
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Target End Date
                </label>
                <input
                  type="date"
                  value={targetEndDate}
                  onChange={(e) => setTargetEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                Internal Execution Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes or reference guidelines..."
                className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
            <Link to="/projects">
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="sm" loading={loading} leftIcon={<FolderPlus size={16} />}>
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

