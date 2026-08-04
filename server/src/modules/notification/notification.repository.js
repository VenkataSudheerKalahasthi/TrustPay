'use strict';

const prisma = require('../../config/database');

class NotificationRepository {
  /**
   * Create Notification
   */
  async createNotification(data) {
    return prisma.notification.create({
      data,
      include: {
        project: { select: { id: true, projectNumber: true, title: true } },
        contract: { select: { id: true, contractNumber: true, title: true } },
      },
    });
  }

  /**
   * Find Notifications for User (Paginated)
   */
  async findUserNotifications(userId, { category, isRead, isArchived = false, limit = 20, page = 1 } = {}) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      isDeleted: false,
      isArchived,
    };

    if (category) {
      where.category = category;
    }
    if (typeof isRead === 'boolean') {
      where.isRead = isRead;
    }

    const [total, notifications, unreadCount] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          project: { select: { id: true, projectNumber: true, title: true } },
          contract: { select: { id: true, contractNumber: true, title: true } },
        },
      }),
      prisma.notification.count({
        where: { userId, isDeleted: false, isRead: false, isArchived: false },
      }),
    ]);

    return { notifications, total, unreadCount, page, limit };
  }

  /**
   * Mark Notification as Read
   */
  async markAsRead(notificationId, userId) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Bulk Mark Notifications as Read
   */
  async bulkMarkAsRead(userId, category = null) {
    const where = { userId, isRead: false, isDeleted: false };
    if (category) {
      where.category = category;
    }

    return prisma.notification.updateMany({
      where,
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Bulk Archive Notifications
   */
  async bulkArchive(userId, category = null) {
    const where = { userId, isArchived: false, isDeleted: false };
    if (category) {
      where.category = category;
    }

    return prisma.notification.updateMany({
      where,
      data: { isArchived: true, archivedAt: new Date() },
    });
  }

  /**
   * Soft Delete Notification
   */
  async deleteNotification(notificationId, userId) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  /**
   * Get User Notification Preferences
   */
  async getNotificationPreference(userId) {
    let pref = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await prisma.notificationPreference.create({
        data: {
          userId,
          inAppNotifications: true,
          emailNotifications: true,
          soundEnabled: true,
          desktopNotifications: true,
        },
      });
    }

    return pref;
  }

  /**
   * Update Notification Preference
   */
  async updateNotificationPreference(userId, data) {
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  /**
   * Record Notification Delivery Log
   */
  async recordDelivery(data) {
    return prisma.notificationDelivery.create({ data });
  }
}

module.exports = new NotificationRepository();
