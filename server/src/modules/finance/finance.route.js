'use strict';

const express = require('express');
const financeController = require('./finance.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createSubscriptionPlanSchema,
  subscribeOrganizationSchema,
  updateBillingProfileSchema,
  addPaymentMethodSchema,
  createCommissionRuleSchema,
  createBudgetSchema,
  generateFinancialReportSchema,
} = require('../../../../shared/src/validators/finance.validator');

const router = express.Router();

router.use(authenticate);

// Subscriptions & Plans
router.get('/plans', financeController.getPlans.bind(financeController));
router.post('/plans', validate({ body: createSubscriptionPlanSchema }), financeController.createPlan.bind(financeController));
router.post('/subscribe', validate({ body: subscribeOrganizationSchema }), financeController.subscribeOrganization.bind(financeController));
router.get('/subscription', financeController.getUserSubscription.bind(financeController));

// Billing Profiles & Payment Methods
router.get('/billing-profile', financeController.getBillingProfile.bind(financeController));
router.put('/billing-profile', validate({ body: updateBillingProfileSchema }), financeController.updateBillingProfile.bind(financeController));
router.post('/payment-methods', validate({ body: addPaymentMethodSchema }), financeController.addPaymentMethod.bind(financeController));

// Commissions
router.get('/commissions/rules', financeController.getCommissionRules.bind(financeController));
router.post('/commissions/rules', validate({ body: createCommissionRuleSchema }), financeController.createCommissionRule.bind(financeController));

// Budgets
router.get('/budgets', financeController.getBudgets.bind(financeController));
router.post('/budgets', validate({ body: createBudgetSchema }), financeController.createBudget.bind(financeController));

// Reports
router.get('/reports', financeController.getReports.bind(financeController));
router.post('/reports', validate({ body: generateFinancialReportSchema }), financeController.generateReport.bind(financeController));

// Dashboard & AI Insights
router.get('/dashboard', financeController.getDashboardSummary.bind(financeController));
router.get('/ai-insights', financeController.getAIInsights.bind(financeController));

module.exports = router;
