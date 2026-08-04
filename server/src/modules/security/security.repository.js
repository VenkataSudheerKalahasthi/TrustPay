'use strict';

const prisma = require('../../config/database');

class SecurityRepository {
  async getLoginHistory(userId, limit = 20) {
    return prisma.loginHistory.findMany({
      where: { userId },
      take: limit,
      orderBy: { loginAt: 'desc' },
    });
  }

  async recordLogin(userId, { ipAddress, userAgent, isSuccess = true }) {
    return prisma.loginHistory.create({
      data: {
        userId,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        isSuccess,
      },
    });
  }

  async getTrustedDevices(userId) {
    return prisma.trustedDevice.findMany({
      where: { userId },
      orderBy: { lastUsedAt: 'desc' },
    });
  }

  async registerTrustedDevice(userId, { deviceName, fingerprint, deviceType = 'DESKTOP' }) {
    return prisma.trustedDevice.upsert({
      where: { fingerprint },
      update: { lastUsedAt: new Date(), isTrusted: true },
      create: { userId, deviceName, fingerprint, deviceType },
    });
  }

  async getActiveSessions(userId) {
    return prisma.userSessionAudit.findMany({
      where: { userId, isRevoked: false },
      orderBy: { loginAt: 'desc' },
    });
  }

  async revokeSession(sessionId, userId) {
    return prisma.userSessionAudit.updateMany({
      where: { sessionId, userId },
      data: { isRevoked: true, revokedAt: new Date() },
    });
  }

  async getSecurityIncidents(userId) {
    return prisma.securityIncident.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSecurityIncident(userId, data) {
    return prisma.securityIncident.create({
      data: {
        userId: userId || null,
        title: data.title,
        description: data.description,
        severity: data.severity || 'HIGH',
      },
    });
  }
}

module.exports = new SecurityRepository();
