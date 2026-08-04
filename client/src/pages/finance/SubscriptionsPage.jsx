import { useState, useEffect } from 'react';
import { financeService } from '@services/finance.service';
import { SubscriptionCard } from '@components/finance/SubscriptionCard';
import { CreatePlanModal } from '@components/finance/CreatePlanModal';
import { ShieldCheck, Plus } from 'lucide-react';

export function SubscriptionsPage() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [p, s] = await Promise.all([
        financeService.getPlans().catch(() => []),
        financeService.getUserSubscription().catch(() => null),
      ]);
      setPlans(p);
      setSubscription(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const handleSelectPlan = async (plan) => {
    try {
      await financeService.subscribeOrganization({ planId: plan.id, billingCycle: 'MONTHLY' });
      fetchSubscriptionData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            SaaS Subscription Management
          </h1>
          <p className="text-slate-400 text-sm">Select enterprise plans, manage subscription provisioning, and scale team usage</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <>
            <SubscriptionCard
              plan={{ id: 'starter', code: 'PLAN_STARTER', name: 'Starter', priceMonthly: 4999, maxProjects: 5, maxUsers: 3, features: ['Standard Escrow', 'Workforce Tracker'] }}
              isCurrent={subscription?.plan?.code === 'PLAN_STARTER'}
              onSelect={handleSelectPlan}
            />
            <SubscriptionCard
              plan={{ id: 'pro', code: 'PLAN_PRO', name: 'Professional', priceMonthly: 14999, maxProjects: 25, maxUsers: 15, features: ['Priority Escrow', 'AI Support Advisory', 'Capacity Planning'] }}
              isCurrent={subscription?.plan?.code === 'PLAN_PRO' || !subscription}
              onSelect={handleSelectPlan}
            />
            <SubscriptionCard
              plan={{ id: 'ent', code: 'PLAN_ENTERPRISE', name: 'Enterprise', priceMonthly: 49999, maxProjects: 100, maxUsers: 50, features: ['Unlimited Escrow', 'Dedicated Account Manager', 'Custom SLAs'] }}
              isCurrent={subscription?.plan?.code === 'PLAN_ENTERPRISE'}
              onSelect={handleSelectPlan}
            />
          </>
        ) : (
          plans.map((p) => (
            <SubscriptionCard
              key={p.id}
              plan={p}
              isCurrent={subscription?.planId === p.id}
              onSelect={handleSelectPlan}
            />
          ))
        )}
      </div>

      <CreatePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSubscriptionData}
      />
    </div>
  );
}
