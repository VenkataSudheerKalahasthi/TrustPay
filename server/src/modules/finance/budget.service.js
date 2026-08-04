'use strict';

const financeRepository = require('./finance.repository');
const notificationService = require('../notification/notification.service');
const activityService = require('../activity/activity.service');

class BudgetService {
  async createBudget(data, userId) {
    const budget = await financeRepository.createBudget(data, userId);

    await activityService.logActivity({
      actorUserId: userId,
      category: 'FINANCE',
      action: 'CREATE_BUDGET',
      title: `Created Corporate Budget "${budget.title}" (₹${budget.totalBudget})`,
    });

    return budget;
  }

  async getBudgets(filter = {}) {
    return financeRepository.findBudgets(filter);
  }

  async evaluateBudgetUtilization(budgetId) {
    const budgets = await financeRepository.findBudgets();
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) {
      return null;
    }

    const utilizationPct = budget.totalBudget > 0 ? (budget.spentAmount / budget.totalBudget) * 100 : 0;

    if (utilizationPct >= 100) {
      await notificationService.createNotification({
        userId: budget.userId,
        category: 'BILLING',
        priority: 'CRITICAL',
        title: `Budget Exceeded - ${budget.title}`,
        message: `Corporate budget #${budget.budgetNumber} has exceeded 100% utilization.`,
      });
    }

    return {
      budgetId,
      utilizationPct: Math.round(utilizationPct * 10) / 10,
      status: utilizationPct >= 100 ? 'EXCEEDED' : utilizationPct >= 80 ? 'WARNING' : 'HEALTHY',
    };
  }
}

module.exports = new BudgetService();
