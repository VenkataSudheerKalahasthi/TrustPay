const express = require('express');
const router = express.Router();
const executiveAnalyticsController = require('./executiveAnalytics.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createDashboardSchema,
  updateDashboardSchema,
  createExecutiveReportSchema,
  scheduleReportSchema,
  createKPIBenchmarkSchema,
  exportReportSchema,
  createExecutiveAlertSchema,
} = require('../../../../shared/src/validators/executiveAnalytics.validator');

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/overview', executiveAnalyticsController.getOverview);

// Dashboards
router.get('/dashboards', executiveAnalyticsController.getDashboards);
router.post('/dashboards', validate(createDashboardSchema), executiveAnalyticsController.createDashboard);
router.patch('/dashboards/:id', validate(updateDashboardSchema), executiveAnalyticsController.updateDashboard);
router.delete('/dashboards/:id', executiveAnalyticsController.deleteDashboard);

// Reports & Exports
router.get('/reports', executiveAnalyticsController.getReports);
router.get('/reports/:id', executiveAnalyticsController.getReportById);
router.post('/reports', validate(createExecutiveReportSchema), executiveAnalyticsController.createReport);
router.post('/reports/:id/export', validate(exportReportSchema), executiveAnalyticsController.exportReport);

// Subscriptions & Logs
router.get('/subscriptions', executiveAnalyticsController.getSubscriptions);
router.post('/subscriptions', validate(scheduleReportSchema), executiveAnalyticsController.createSubscription);
router.get('/execution-logs', executiveAnalyticsController.getExecutionLogs);

// Benchmarks & Alerts
router.get('/kpi-benchmarks', executiveAnalyticsController.getKPIBenchmarks);
router.put('/kpi-benchmarks/:code', validate(createKPIBenchmarkSchema), executiveAnalyticsController.upsertKPIBenchmark);
router.get('/alerts', executiveAnalyticsController.getAlerts);
router.post('/alerts', validate(createExecutiveAlertSchema), executiveAnalyticsController.createAlert);

// AI Insights
router.get('/ai-insights', executiveAnalyticsController.getAIInsight);

module.exports = router;
