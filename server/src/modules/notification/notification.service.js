'use strict';

const notificationRepository = require('./notification.repository');
const { NOTIFICATION_EMAIL_TEMPLATES } = require('./notification.template');
const activityService = require('../activity/activity.service');
const { sendEmail } = require('../../utils/email');
const { getSocketIO } = require('../../config/socket');
const { prisma } = require('../../config/database');
const { logger } = require('../../utils/logger');

class NotificationService {
  /**
   * Create and Dispatch Notification (In-App, Realtime Socket, Email)
   */
  async createNotification({
    userId,
    category = 'SYSTEM',
    priority = 'NORMAL',
    title,
    message,
    linkUrl = null,
    metadata = null,
    projectId = null,
    contractId = null,
    templateCode = 'GENERIC',
    emailParams = {},
  }) {
    // 1. Fetch user notification preferences
    const pref = await notificationRepository.getNotificationPreference(userId);

    // Check if in-app / category updates enabled
    if (pref.inAppNotifications === false) {
      return null;
    }

    // 2. Save Notification to DB
    const notification = await notificationRepository.createNotification({
      userId,
      category,
      priority,
      title,
      message,
      linkUrl,
      metadataJson: metadata ? JSON.stringify(metadata) : null,
      projectId,
      contractId,
    });

    // 3. Emit Realtime Socket Event if Socket.IO is initialized
    try {
      const io = getSocketIO();
      if (io) {
        const userRoom = `user:${userId}`;
        const unreadCount = await prisma.notification.count({
          where: { userId, isRead: false, isDeleted: false, isArchived: false },
        });

        io.to(userRoom).emit('notification:received', notification);
        io.to(userRoom).emit('notification:unread_count', { unreadCount });
      }
    } catch (err) {
      logger.warn('Socket realtime notification emission skipped', { userId, error: err.message });
    }

    // 4. Send Transactional Email if enabled
    if (pref.emailNotifications) {
      const recipientUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true },
      });

      if (recipientUser && recipientUser.email) {
        try {
          const templateFn = NOTIFICATION_EMAIL_TEMPLATES[templateCode] || NOTIFICATION_EMAIL_TEMPLATES.GENERIC;
          const emailContent = templateFn({
            ...emailParams,
            title,
            message,
            linkUrl: linkUrl || '#',
          });

          await sendEmail({
            to: recipientUser.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          await notificationRepository.recordDelivery({
            notificationId: notification.id,
            userId,
            channel: 'EMAIL',
            status: 'SENT',
          });
        } catch (emailErr) {
          logger.error('Failed to send notification email', { userId, error: emailErr.message });
          await notificationRepository.recordDelivery({
            notificationId: notification.id,
            userId,
            channel: 'EMAIL',
            status: 'FAILED',
            errorMessage: emailErr.message,
          });
        }
      }
    }

    // 5. Log Activity Feed Entry
    await activityService.logActivity({
      actorUserId: metadata?.actorUserId || null,
      targetUserId: userId,
      category: category === 'SYSTEM' ? 'SYSTEM' : category,
      action: 'NOTIFICATION_TRIGGERED',
      title,
      description: message,
      projectId,
      contractId,
      metadata,
    });

    return notification;
  }

  /**
   * Get User Notifications
   */
  async getUserNotifications(userId, query = {}) {
    return notificationRepository.findUserNotifications(userId, query);
  }

  /**
   * Mark Single Notification as Read
   */
  async markAsRead(notificationId, userId) {
    return notificationRepository.markAsRead(notificationId, userId);
  }

  /**
   * Bulk Mark as Read
   */
  async bulkMarkAsRead(userId, category = null) {
    return notificationRepository.bulkMarkAsRead(userId, category);
  }

  /**
   * Bulk Archive
   */
  async bulkArchive(userId, category = null) {
    return notificationRepository.bulkArchive(userId, category);
  }

  /**
   * Soft Delete Notification
   */
  async deleteNotification(notificationId, userId) {
    return notificationRepository.deleteNotification(notificationId, userId);
  }

  /**
   * Get Preferences
   */
  async getPreferences(userId) {
    return notificationRepository.getNotificationPreference(userId);
  }

  /**
   * Update Preferences
   */
  async updatePreferences(userId, data) {
    return notificationRepository.updateNotificationPreference(userId, data);
  }

  async sendNotification(data) {
    return this.createNotification({
      userId: data.userId,
      title: data.title,
      message: data.message,
      category: data.category || data.type || 'SYSTEM',
      linkUrl: data.linkUrl || (data.entityId ? `/collaboration` : null),
      metadata: data,
    });
  }
}

module.exports = new NotificationService();
