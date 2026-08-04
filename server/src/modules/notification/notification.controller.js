'use strict';

const notificationService = require('./notification.service');
const activityService = require('../activity/activity.service');
const preferenceService = require('../preference/preference.service');
const ApiResponse = require('../../utils/ApiResponse');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await notificationService.getUserNotifications(userId, req.query);
      return ApiResponse.success(res, result, 'User notifications retrieved');
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await notificationService.markAsRead(id, userId);
      return ApiResponse.success(res, { success: true }, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  }

  async bulkMarkAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const { category } = req.body || {};
      const result = await notificationService.bulkMarkAsRead(userId, category);
      return ApiResponse.success(res, result, 'Notifications bulk marked as read');
    } catch (err) {
      next(err);
    }
  }

  async bulkArchive(req, res, next) {
    try {
      const userId = req.user.id;
      const { category } = req.body || {};
      const result = await notificationService.bulkArchive(userId, category);
      return ApiResponse.success(res, result, 'Notifications bulk archived');
    } catch (err) {
      next(err);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await notificationService.deleteNotification(id, userId);
      return ApiResponse.success(res, { success: true }, 'Notification deleted');
    } catch (err) {
      next(err);
    }
  }

  async getActivityFeed(req, res, next) {
    try {
      const result = await activityService.getActivityFeed(req.query);
      return ApiResponse.success(res, result, 'Activity feed retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getUserPreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const prefs = await preferenceService.getUserPreferences(userId);
      const notifPrefs = await notificationService.getPreferences(userId);
      return ApiResponse.success(res, { userPreferences: prefs, notificationPreferences: notifPrefs }, 'User preferences retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateUserPreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const prefs = await preferenceService.updateUserPreferences(userId, req.body.userPreferences || {});
      const notifPrefs = await notificationService.updatePreferences(userId, req.body.notificationPreferences || {});
      return ApiResponse.success(res, { userPreferences: prefs, notificationPreferences: notifPrefs }, 'User preferences updated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
