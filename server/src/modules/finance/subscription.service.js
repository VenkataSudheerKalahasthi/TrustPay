'use strict';

const financeRepository = require('./finance.repository');
const notificationService = require('../notification/notification.service');
const activityService = require('../activity/activity.service');

class SubscriptionService {
  async createPlan(data) {
    return financeRepository.createSubscriptionPlan(data);
  }

  async getPlans() {
    return financeRepository.findSubscriptionPlans();
  }

  async subscribeOrganization(userId, planId, billingCycle = 'MONTHLY') {
    const subscription = await financeRepository.createOrganizationSubscription({
      userId,
      planId,
      billingCycle,
    });

    // Create initial invoice & revenue ledger entry
    const invoice = await financeRepository.createSubscriptionInvoice({
      subscriptionId: subscription.id,
      amount: subscription.plan.priceMonthly,
      taxAmount: subscription.plan.priceMonthly * 0.18,
      status: 'PAID',
    });

    await financeRepository.createRevenueEntry({
      userId,
      category: 'SUBSCRIPTION',
      amount: invoice.totalAmount,
      description: `Subscription fee for plan ${subscription.plan.name} (${invoice.invoiceNumber})`,
    });

    await activityService.logActivity({
      actorUserId: userId,
      category: 'FINANCE',
      action: 'SUBSCRIBE_PLAN',
      title: `Subscribed to ${subscription.plan.name} Plan`,
    });

    await notificationService.createNotification({
      userId,
      category: 'BILLING',
      priority: 'HIGH',
      title: `Subscription Activated - ${subscription.plan.name}`,
      message: `Your subscription #${subscription.subscriptionNumber} is now active. Invoice #${invoice.invoiceNumber} generated.`,
    });

    return subscription;
  }

  async getUserSubscription(userId) {
    return financeRepository.findOrganizationSubscriptionByUserId(userId);
  }
}

module.exports = new SubscriptionService();
