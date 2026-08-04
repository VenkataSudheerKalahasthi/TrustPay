'use strict';

const prisma = require('../../config/database');

const DEFAULT_INTEGRATIONS = [
  { code: 'GOOGLE_CALENDAR', name: 'Google Calendar Sync', category: 'PRODUCTIVITY' },
  { code: 'GOOGLE_MEET', name: 'Google Meet Audio/Video', category: 'COMMUNICATION' },
  { code: 'SLACK', name: 'Slack Notifications', category: 'COLLABORATION' },
  { code: 'MICROSOFT_OUTLOOK', name: 'Microsoft Outlook Mail & Calendar', category: 'PRODUCTIVITY' },
  { code: 'MICROSOFT_TEAMS', name: 'Microsoft Teams Integration', category: 'COMMUNICATION' },
  { code: 'ZAPIER', name: 'Zapier Automation Webhooks', category: 'AUTOMATION' },
];

class IntegrationRepository {
  async getIntegrations(userId) {
    const count = await prisma.integration.count();
    if (count === 0) {
      await prisma.integration.createMany({
        data: DEFAULT_INTEGRATIONS,
      });
    }

    return prisma.integration.findMany({
      include: {
        credentials: {
          where: { userId },
          select: { id: true, expiresAt: true, updatedAt: true },
        },
      },
    });
  }

  async toggleIntegrationStatus(id, status) {
    return prisma.integration.update({
      where: { id },
      data: { status },
    });
  }

  async saveCredentials(integrationId, userId, data) {
    return prisma.integrationCredential.upsert({
      where: { integrationId_userId: { integrationId, userId } },
      update: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || null,
        expiresAt: data.expiresAt || null,
        updatedAt: new Date(),
      },
      create: {
        integrationId,
        userId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || null,
        expiresAt: data.expiresAt || null,
      },
    });
  }
}

module.exports = new IntegrationRepository();
