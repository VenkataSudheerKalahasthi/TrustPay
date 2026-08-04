'use strict';

const adminRepository = require('./admin.repository');

class PlatformMonitoringService {
  async getMetrics() {
    const overview = await adminRepository.getOverviewMetrics();
    return {
      usersMetric: { count: overview.totalUsers, status: 'OPTIMAL' },
      contractsMetric: { count: overview.totalContracts, status: 'OPTIMAL' },
      escrowMetric: { volume: overview.totalEscrowVolume, currency: 'INR', status: 'HEALTHY' },
      aiMetric: { totalTokens: overview.totalAiTokens, status: 'HEALTHY' },
      systemMetric: { webhooks: overview.totalWebhooks, status: 'ACTIVE' },
    };
  }
}

module.exports = new PlatformMonitoringService();
