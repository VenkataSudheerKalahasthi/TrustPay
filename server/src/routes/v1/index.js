'use strict';

const { Router } = require('express');
const healthRouter = require('./health.route');
const authRouter = require('../../modules/auth/auth.route');
const workerRouter = require('../../modules/worker/worker.route');
const clientRouter = require('../../modules/client/client.route');
const taxonomyRouter = require('../../modules/taxonomies/taxonomy.route');
const contractRouter = require('../../modules/contract/contract.route');
const escrowRouter = require('../../modules/escrow/escrow.route');
const projectRouter = require('../../modules/project/project.route');
const chatRouter = require('../../modules/chat/chat.route');
const analyticsRouter = require('../../modules/analytics/analytics.route');
const notificationRouter = require('../../modules/notification/notification.route');
const aiRouter = require('../../modules/ai/ai.route');
const searchRouter = require('../../modules/search/search.route');
const productivityRouter = require('../../modules/productivity/productivity.route');
const organizationRouter = require('../../modules/organization/organization.route');
const integrationRouter = require('../../modules/integration/integration.route');
const adminRouter = require('../../modules/admin/admin.route');
const securityRouter = require('../../modules/security/security.route');
const fileRouter = require('../../modules/file/file.route');
const operationRouter = require('../../modules/operation/operation.route');
const marketplaceRouter = require('../../modules/marketplace/marketplace.route');
const talentRouter = require('../../modules/talent/talent.route');
const workforceRouter = require('../../modules/workforce/workforce.route');
const supportRouter = require('../../modules/support/support.route');
const financeRouter = require('../../modules/finance/finance.route');
const platformRouter = require('../../modules/platform/platform.route');
const executiveAnalyticsRouter = require('../../modules/executive-analytics/executiveAnalytics.route');
const performanceRouter = require('../../modules/performance/performance.route');
const releaseRouter = require('../../modules/release/release.route');

const v1Router = Router();

/**
 * API v1 Routes
 */
v1Router.use('/health', healthRouter);
v1Router.use('/auth', authRouter);

// ─── Phase 2 & Phase 3 Feature Modules ──────────────────────────────────────────
v1Router.use('/workers', workerRouter);
v1Router.use('/clients', clientRouter);
v1Router.use('/taxonomies', taxonomyRouter);
v1Router.use('/contracts', contractRouter);
v1Router.use('/escrow', escrowRouter);
v1Router.use('/projects', projectRouter);
v1Router.use('/chat', chatRouter);
v1Router.use('/analytics', analyticsRouter);
v1Router.use('/notifications', notificationRouter);
v1Router.use('/ai', aiRouter);
v1Router.use('/search', searchRouter);
v1Router.use('/productivity', productivityRouter);
v1Router.use('/organizations', organizationRouter);
v1Router.use('/integrations', integrationRouter);
v1Router.use('/admin', adminRouter);
v1Router.use('/security', securityRouter);
v1Router.use('/files', fileRouter);
v1Router.use('/operations', operationRouter);
v1Router.use('/marketplace', marketplaceRouter);
v1Router.use('/talent', talentRouter);
v1Router.use('/workforce', workforceRouter);
v1Router.use('/support', supportRouter);
v1Router.use('/finance', financeRouter);
v1Router.use('/platform', platformRouter);
v1Router.use('/executive-analytics', executiveAnalyticsRouter);
v1Router.use('/performance', performanceRouter);
v1Router.use('/release', releaseRouter);

module.exports = v1Router;
