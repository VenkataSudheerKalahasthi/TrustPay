'use strict';

const express = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  analyticsQuerySchema,
  reportGenerationSchema,
  updateDashboardPreferenceSchema,
  createExecutiveDashboardSchema,
  createDashboardWidgetSchema,
  createKPIDefinitionSchema,
  createForecastRequestSchema,
  createReportScheduleSchema,
  createBusinessGoalSchema,
  updateGoalProgressSchema,
} = require('../../../../shared/src/validators/analytics.validator');

const router = express.Router();

router.use(authenticate);

// Existing Routes
router.get('/dashboard', validate({ query: analyticsQuerySchema }), analyticsController.getDashboard.bind(analyticsController));
router.get('/preferences', analyticsController.getPreferences.bind(analyticsController));
router.put('/preferences', validate({ body: updateDashboardPreferenceSchema }), analyticsController.updatePreferences.bind(analyticsController));
router.post('/reports/export', validate({ body: reportGenerationSchema }), analyticsController.exportReport.bind(analyticsController));

// Phase 4 Part 6: Executive BI & Analytics Routes
router.get('/bi/dashboards', analyticsController.getExecutiveDashboards.bind(analyticsController));
router.post('/bi/dashboards', validate({ body: createExecutiveDashboardSchema }), analyticsController.createExecutiveDashboard.bind(analyticsController));
router.post('/bi/widgets', validate({ body: createDashboardWidgetSchema }), analyticsController.addDashboardWidget.bind(analyticsController));

router.get('/kpis', analyticsController.getKPIs.bind(analyticsController));
router.post('/kpis', validate({ body: createKPIDefinitionSchema }), analyticsController.createKPI.bind(analyticsController));

router.get('/forecasts', analyticsController.getForecasts.bind(analyticsController));
router.post('/forecasts', validate({ body: createForecastRequestSchema }), analyticsController.generateForecast.bind(analyticsController));

router.get('/reports/executive', analyticsController.getExecutiveReports.bind(analyticsController));
router.post('/reports/executive', analyticsController.generateExecutiveReport.bind(analyticsController));

router.get('/reports/schedules', analyticsController.getReportSchedules.bind(analyticsController));
router.post('/reports/schedules', validate({ body: createReportScheduleSchema }), analyticsController.createReportSchedule.bind(analyticsController));

router.get('/scorecards', analyticsController.getScorecards.bind(analyticsController));

router.get('/goals', analyticsController.getBusinessGoals.bind(analyticsController));
router.post('/goals', validate({ body: createBusinessGoalSchema }), analyticsController.createBusinessGoal.bind(analyticsController));
router.post('/goals/:goalId/progress', validate({ body: updateGoalProgressSchema }), analyticsController.logGoalProgress.bind(analyticsController));

router.get('/insights', analyticsController.getDecisionInsights.bind(analyticsController));

module.exports = router;
