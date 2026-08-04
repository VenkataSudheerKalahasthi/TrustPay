'use strict';

const express = require('express');
const notificationController = require('./notification.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  notificationQuerySchema,
  activityQuerySchema,
} = require('../../../../shared/src/validators/notification.validator');

const router = express.Router();

router.use(authenticate);

// List User Notifications
router.get(
  '/',
  validate({ query: notificationQuerySchema }),
  notificationController.getNotifications.bind(notificationController)
);

// Mark Single Notification Read
router.patch(
  '/:id/read',
  notificationController.markAsRead.bind(notificationController)
);

// Bulk Mark Read
router.post(
  '/mark-all-read',
  notificationController.bulkMarkAsRead.bind(notificationController)
);

// Bulk Archive
router.post(
  '/archive-all',
  notificationController.bulkArchive.bind(notificationController)
);

// Delete Notification
router.delete(
  '/:id',
  notificationController.deleteNotification.bind(notificationController)
);

// Get Activity Feed
router.get(
  '/activities/feed',
  validate({ query: activityQuerySchema }),
  notificationController.getActivityFeed.bind(notificationController)
);

// Get Preferences (User + Notification)
router.get(
  '/preferences/user',
  notificationController.getUserPreferences.bind(notificationController)
);

// Update Preferences
router.put(
  '/preferences/user',
  notificationController.updateUserPreferences.bind(notificationController)
);

module.exports = router;
