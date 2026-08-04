import { useState, useEffect } from 'react';
import { financeService } from '@services/finance.service';
import { BudgetCard } from '@components/finance/BudgetCard';
import { BudgetAllocationTable } from '@components/finance/BudgetAllocationTable';
import { CreateBudgetModal } from '@components/finance/CreateBudgetModal';
import { PiggyBank, Plus } from 'lucide-react';

export function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await financeService.getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-sky-400" />
            Corporate Budget & Department Allocation
          </h1>
          <p className="text-slate-400 text-sm">Define fiscal year budgets, allocate department spend caps, and monitor variance</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <PiggyBank className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No corporate budgets defined</p>
          </div>
        ) : (
          budgets.map((b) => <BudgetCard key={b.id} budget={b} />)
        )}
      </div>

      {budgets[0]?.allocations && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Department Allocation Ledger ({budgets[0].title})</h3>
          <BudgetAllocationTable allocations={budgets[0].allocations} />
        </div>
      )}

      <CreateBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBudgets}
      />
    </div>
  );
}
