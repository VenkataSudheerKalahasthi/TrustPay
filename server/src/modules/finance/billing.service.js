'use strict';

const financeRepository = require('./finance.repository');
const notificationService = require('../notification/notification.service');

class BillingService {
  async getBillingProfile(userId) {
    let profile = await financeRepository.findBillingProfileByUserId(userId);
    if (!profile) {
      profile = await financeRepository.upsertBillingProfile(userId, {
        billingEmail: `user_${userId}@trustpay.com`,
        country: 'India',
      });
    }
    return profile;
  }

  async updateBillingProfile(userId, data) {
    const updated = await financeRepository.upsertBillingProfile(userId, data);

    await notificationService.createNotification({
      userId,
      category: 'BILLING',
      priority: 'NORMAL',
      title: 'Billing Profile Updated',
      message: 'Your billing address and tax registration details have been updated.',
    });

    return updated;
  }

  async addPaymentMethod(userId, data) {
    const profile = await this.getBillingProfile(userId);
    return financeRepository.addPaymentMethod({
      ...data,
      billingProfileId: profile.id,
      userId,
    });
  }
}

module.exports = new BillingService();
