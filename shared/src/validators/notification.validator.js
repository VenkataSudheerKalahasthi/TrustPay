'use strict';

const { z } = require('zod');

const notificationCategoryEnum = z.enum([
  'PROJECT',
  'CONTRACT',
  'ESCROW',
  'PAYMENT',
  'INVOICE',
  'MESSAGE',
  'PROFILE',
  'SYSTEM',
]);

const notificationPriorityEnum = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']);
const themePreferenceEnum = z.enum(['DARK', 'LIGHT', 'SYSTEM']);

const updateNotificationPreferenceSchema = z.object({
  inAppNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
  desktopNotifications: z.boolean().optional(),
  projectUpdates: z.boolean().optional(),
  contractUpdates: z.boolean().optional(),
  escrowUpdates: z.boolean().optional(),
  messageUpdates: z.boolean().optional(),
});

const updateUserPreferenceSchema = z.object({
  theme: themePreferenceEnum.optional(),
  language: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
  currency: z.string().max(10).optional(),
  dateFormat: z.string().max(20).optional(),
  timeFormat: z.string().max(20).optional(),
  activityVisibility: z.string().max(20).optional(),
});

const notificationQuerySchema = z.object({
  category: notificationCategoryEnum.optional(),
  priority: notificationPriorityEnum.optional(),
  isRead: z.coerce.boolean().optional(),
  isArchived: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
});

const activityQuerySchema = z.object({
  category: z.string().optional(),
  actorUserId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
});

module.exports = {
  updateNotificationPreferenceSchema,
  updateUserPreferenceSchema,
  notificationQuerySchema,
  activityQuerySchema,
};
