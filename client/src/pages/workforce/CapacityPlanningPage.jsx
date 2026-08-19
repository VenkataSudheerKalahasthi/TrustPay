import { useState, useEffect } from 'react';
import { workforceService } from '@services/workforce.service';
import { CapacityGauge } from '@components/workforce/CapacityGauge';
import { CreateCapacityPlanModal } from '@components/workforce/CreateCapacityPlanModal';
import { Zap, Plus } from 'lucide-react';

export function CapacityPlanningPage() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await workforceService.getCapacityPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Workforce Capacity Planning
          </h1>
          <p className="text-slate-400 text-sm">Define target hours, monitor utilization %, and forecast resource availability</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Create Capacity Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <Zap className="w-8 h-8 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No active capacity plans defined</p>
          </div>
        ) : (
          plans.map((plan) => <CapacityGauge key={plan.id} plan={plan} />)
        )}
      </div>

      <CreateCapacityPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPlans}
      />
    </div>
  );
}
