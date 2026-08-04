'use strict';

const prisma = require('../../config/database');

const DEFAULT_FEATURE_FLAGS = [
  { key: 'AI_COPILOT_V2', name: 'AI Copilot V2 Engine', description: 'Enable advanced Gemini-based AI assistant features', isEnabled: true, rolloutPercentage: 100 },
  { key: 'ESCROW_AUTO_RELEASE', name: 'Escrow Auto-Release on Approval', description: 'Automatically release escrow upon client deliverable approval', isEnabled: true, rolloutPercentage: 100 },
  { key: 'PUBLIC_REST_API', name: 'Public REST API V1', description: 'Enable API Key generation and external REST endpoints', isEnabled: true, rolloutPercentage: 100 },
  { key: 'WEBHOOK_SUBSCRIPTIONS', name: 'Realtime Webhook Delivery', description: 'Enable event dispatch to external webhooks', isEnabled: true, rolloutPercentage: 100 },
];

class FeatureFlagService {
  async getFeatureFlags() {
    const count = await prisma.featureFlag.count();
    if (count === 0) {
      await prisma.featureFlag.createMany({
        data: DEFAULT_FEATURE_FLAGS,
      });
    }

    return prisma.featureFlag.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async toggleFlag(id, isEnabled) {
    return prisma.featureFlag.update({
      where: { id },
      data: { isEnabled, updatedAt: new Date() },
    });
  }

  async createFlag(data) {
    return prisma.featureFlag.create({ data });
  }

  /**
   * Evaluate if Feature Flag is Enabled for a given context
   */
  async isFeatureEnabled(key, _context = {}) {
    const flag = await prisma.featureFlag.findUnique({
      where: { key },
    });

    if (!flag) {
      return true;
    }
    if (!flag.isEnabled) {
      return false;
    }
    return true;
  }
}

module.exports = new FeatureFlagService();
