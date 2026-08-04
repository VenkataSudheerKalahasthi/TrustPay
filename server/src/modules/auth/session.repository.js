'use strict';

const { BaseRepository } = require('../../repositories/base.repository');

/**
 * User Session Repository.
 * Handles database operations for the Session model.
 */
class SessionRepository extends BaseRepository {
  constructor() {
    super('session');
  }

  /**
   * Create a new user session.
   *
   * @param {object} params
   * @param {string} params.userId
   * @param {string} [params.refreshTokenId]
   * @param {string} [params.deviceName]
   * @param {string} [params.browser]
   * @param {string} [params.operatingSystem]
   * @param {string} [params.ipAddress]
   * @param {Date} params.expiresAt
   * @returns {Promise<import('@prisma/client').Session>}
   */
  async createSession({
    userId,
    refreshTokenId = null,
    deviceName = null,
    browser = null,
    operatingSystem = null,
    ipAddress = null,
    expiresAt,
  }) {
    return this.prisma.session.create({
      data: {
        userId,
        refreshTokenId,
        deviceName,
        browser,
        operatingSystem,
        ipAddress,
        loginTime: new Date(),
        lastActiveTime: new Date(),
        expiresAt,
        status: 'ACTIVE',
      },
    });
  }

  /**
   * Find session by associated refresh token ID.
   *
   * @param {string} refreshTokenId
   * @returns {Promise<import('@prisma/client').Session|null>}
   */
  async findByRefreshTokenId(refreshTokenId) {
    if (!refreshTokenId) {return null;}
    return this.prisma.session.findUnique({
      where: { refreshTokenId },
    });
  }

  /**
   * Find active sessions for a user.
   *
   * @param {string} userId
   * @returns {Promise<import('@prisma/client').Session[]>}
   */
  async findActiveSessionsByUserId(userId) {
    return this.prisma.session.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: { lastActiveTime: 'desc' },
    });
  }

  /**
   * Update session when refresh token is rotated.
   *
   * @param {string} oldRefreshTokenId
   * @param {string} newRefreshTokenId
   * @param {Date} expiresAt
   * @returns {Promise<import('@prisma/client').Session|null>}
   */
  async updateSessionOnRotation(oldRefreshTokenId, newRefreshTokenId, expiresAt) {
    const existing = await this.findByRefreshTokenId(oldRefreshTokenId);
    if (!existing) {return null;}

    return this.prisma.session.update({
      where: { id: existing.id },
      data: {
        refreshTokenId: newRefreshTokenId,
        lastActiveTime: new Date(),
        expiresAt,
      },
    });
  }

  /**
   * Mark single session as REVOKED.
   *
   * @param {string} sessionId
   * @returns {Promise<import('@prisma/client').Session>}
   */
  async revokeSession(sessionId) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'REVOKED',
        logoutTime: new Date(),
      },
    });
  }

  /**
   * Mark session as REVOKED by refresh token ID.
   *
   * @param {string} refreshTokenId
   * @returns {Promise<{ count: number }>}
   */
  async revokeSessionByRefreshTokenId(refreshTokenId) {
    if (!refreshTokenId) {return { count: 0 };}
    return this.prisma.session.updateMany({
      where: { refreshTokenId, status: 'ACTIVE' },
      data: {
        status: 'REVOKED',
        logoutTime: new Date(),
      },
    });
  }

  /**
   * Revoke all active sessions for a user (Logout All Devices / Security event).
   *
   * @param {string} userId
   * @returns {Promise<{ count: number }>}
   */
  async revokeAllUserSessions(userId) {
    return this.prisma.session.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: {
        status: 'REVOKED',
        logoutTime: new Date(),
      },
    });
  }

  /**
   * Mark session as EXPIRED.
   *
   * @param {string} sessionId
   * @returns {Promise<import('@prisma/client').Session>}
   */
  async markSessionExpired(sessionId) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'EXPIRED',
      },
    });
  }
}

module.exports = new SessionRepository();
