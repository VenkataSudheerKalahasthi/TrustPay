'use strict';

const workforceRepository = require('./workforce.repository');

class CapacityService {
  async createCapacityPlan(data) {
    return workforceRepository.createCapacityPlan(data);
  }

  async getCapacityPlans(organizationId) {
    const plans = await workforceRepository.findCapacityPlans(organizationId);
    return plans.map((plan) => this.enhanceCapacityPlanMetrics(plan));
  }

  async allocateResource(data) {
    const allocation = await workforceRepository.createWorkAllocation(data);

    // Update plan total allocated hours
    const plans = await workforceRepository.findCapacityPlans(data.capacityPlanId);
    if (plans && plans.length > 0) {
      const plan = plans[0];
      const newTotal = (plan.totalAllocatedHours || 0) + data.allocatedHours;
      const status = newTotal > plan.targetCapacityHours ? 'OVERLOADED' : newTotal === plan.targetCapacityHours ? 'FULL' : 'AVAILABLE';
      await workforceRepository.createCapacityPlan({
        ...plan,
        totalAllocatedHours: newTotal,
        status,
      });
    }

    return allocation;
  }

  async getWorkAllocations(filter = {}) {
    return workforceRepository.findWorkAllocations(filter);
  }

  enhanceCapacityPlanMetrics(plan) {
    const target = plan.targetCapacityHours || 1;
    const allocated = plan.totalAllocatedHours || 0;
    const utilizationPct = Math.round((allocated / target) * 100 * 10) / 10;
    const availableHours = Math.max(0, target - allocated);
    const isOverallocated = allocated > target;

    return {
      ...plan,
      utilizationPct,
      availableHours,
      isOverallocated,
      status: isOverallocated ? 'OVERLOADED' : allocated >= target ? 'FULL' : 'AVAILABLE',
    };
  }
}

module.exports = new CapacityService();
