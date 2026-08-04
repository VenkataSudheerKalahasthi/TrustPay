'use strict';

const prisma = require('../../config/database');

/**
 * Presence Engine
 * Manages user presence statuses: ONLINE, AWAY, BUSY, OFFLINE, INVISIBLE.
 * Handles heartbeats and automatic disconnect detection.
 */
class PresenceEngine {
  /**
   * Update presence status for a user.
   */
  static async updatePresence(userId, status, socketId = null) {
    const now = new Date();
    return prisma.onlinePresence.upsert({
      where: { userId },
      update: {
        status,
        socketId: status === 'OFFLINE' ? null : socketId,
        lastHeartbeatAt: now,
        lastSeenAt: now,
      },
      create: {
        userId,
        status,
        socketId,
        lastHeartbeatAt: now,
        lastSeenAt: now,
      },
    });
  }

  /**
   * Record socket heartbeat ping.
   */
  static async recordHeartbeat(userId) {
    const now = new Date();
    return prisma.onlinePresence.update({
      where: { userId },
      data: {
        lastHeartbeatAt: now,
        lastSeenAt: now,
      },
    }).catch(() => null);
  }

  /**
   * Get presence for user or array of user IDs.
   */
  static async getPresence(userIds) {
    if (!Array.isArray(userIds)) {
      return prisma.onlinePresence.findUnique({ where: { userId: userIds } });
    }
    return prisma.onlinePresence.findMany({
      where: { userId: { in: userIds } },
    });
  }
}

module.exports = PresenceEngine;
