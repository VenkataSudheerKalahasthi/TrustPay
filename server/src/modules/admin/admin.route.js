'use strict';

const express = require('express');
const adminController = require('./admin.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createAnnouncementSchema,
  createFeatureFlagSchema,
} = require('../../../../shared/src/validators/adminOrg.validator');
const {
  restrictUserSchema,
  addUserNoteSchema,
  reviewVerificationSchema,
  bulkOperationSchema,
  updateContractOversightSchema,
  updateWalletOversightSchema,
} = require('../../../../shared/src/validators/admin.validator');

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

// Executive Metrics & Announcements
router.get('/overview', adminController.getOverviewMetrics.bind(adminController));
router.get('/announcements', adminController.getAnnouncements.bind(adminController));
router.post('/announcements', validate({ body: createAnnouncementSchema }), adminController.createAnnouncement.bind(adminController));

// Feature Flags
router.get('/feature-flags', adminController.getFeatureFlags.bind(adminController));
router.post('/feature-flags', validate({ body: createFeatureFlagSchema }), adminController.createFeatureFlag.bind(adminController));
router.patch('/feature-flags/:id/toggle', adminController.toggleFeatureFlag.bind(adminController));

// Platform Configuration Settings
router.get('/settings', adminController.getPlatformSettings.bind(adminController));
router.put('/settings', adminController.updatePlatformSetting.bind(adminController));

// User Administration
router.get('/users/search', adminController.searchUsers.bind(adminController));
router.post('/users/suspend', adminController.toggleUserSuspension.bind(adminController));
router.post('/users/restrict', validate({ body: restrictUserSchema }), adminController.restrictUser.bind(adminController));
router.post('/users/notes', validate({ body: addUserNoteSchema }), adminController.addUserNote.bind(adminController));

// Verification Center
router.get('/verifications', adminController.getVerificationReviews.bind(adminController));
router.patch('/verifications/:id', validate({ body: reviewVerificationSchema }), adminController.reviewVerification.bind(adminController));

// Contract Oversight
router.get('/contracts/oversight', adminController.getContractsOversight.bind(adminController));
router.post('/contracts/oversight', validate({ body: updateContractOversightSchema }), adminController.updateContractOversight.bind(adminController));

// Wallet Oversight
router.get('/wallets/oversight', adminController.getWalletsOversight.bind(adminController));
router.post('/wallets/oversight', validate({ body: updateWalletOversightSchema }), adminController.updateWalletOversight.bind(adminController));

// Bulk Operations
router.get('/bulk-operations', adminController.getBulkOperations.bind(adminController));
router.post('/bulk-operations', validate({ body: bulkOperationSchema }), adminController.executeBulkOperation.bind(adminController));

// Monitoring & Audit Logs
router.get('/metrics', adminController.getPlatformMetrics.bind(adminController));
router.get('/audit-history', adminController.getAdminActionHistory.bind(adminController));

module.exports = router;
