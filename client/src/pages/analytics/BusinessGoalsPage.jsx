import { useState, useEffect } from 'react';
import { analyticsService } from '@services/analytics.service';
import { GoalProgressCard } from '@components/analytics/GoalProgressCard';
import { CreateGoalModal } from '@components/analytics/CreateGoalModal';
import { Target, Plus } from 'lucide-react';

export function BusinessGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getBusinessGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Strategic Business Goals & Milestone Tracking
          </h1>
          <p className="text-slate-400 text-sm">Define corporate objectives, monitor progress gauges, and track risk status</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Create Strategic Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <Target className="w-10 h-10 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No business goals defined</p>
          </div>
        ) : (
          goals.map((g) => <GoalProgressCard key={g.id} goal={g} />)
        )}
      </div>

      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchGoals}
      />
    </div>
  );
}
