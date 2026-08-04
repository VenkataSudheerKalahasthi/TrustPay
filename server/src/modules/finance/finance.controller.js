'use strict';

const subscriptionService = require('./subscription.service');
const billingService = require('./billing.service');
const commissionService = require('./commission.service');
const budgetService = require('./budget.service');
const financeReportService = require('./financeReport.service');
const financeService = require('./finance.service');

class FinanceController {
  // Subscriptions & Plans
  async createPlan(req, res) {
    const plan = await subscriptionService.createPlan(req.body);
    res.status(201).json({ success: true, message: 'Subscription plan created', data: plan });
  }

  async getPlans(req, res) {
    const plans = await subscriptionService.getPlans();
    res.status(200).json({ success: true, data: plans });
  }

  async subscribeOrganization(req, res) {
    const subscription = await subscriptionService.subscribeOrganization(req.user.id, req.body.planId, req.body.billingCycle);
    res.status(201).json({ success: true, message: 'Subscribed to plan successfully', data: subscription });
  }

  async getUserSubscription(req, res) {
    const subscription = await subscriptionService.getUserSubscription(req.user.id);
    res.status(200).json({ success: true, data: subscription });
  }

  // Billing Profiles & Payment Methods
  async getBillingProfile(req, res) {
    const profile = await billingService.getBillingProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  }

  async updateBillingProfile(req, res) {
    const profile = await billingService.updateBillingProfile(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Billing profile updated', data: profile });
  }

  async addPaymentMethod(req, res) {
    const method = await billingService.addPaymentMethod(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Payment method saved', data: method });
  }

  // Commissions
  async createCommissionRule(req, res) {
    const rule = await commissionService.createCommissionRule(req.body);
    res.status(201).json({ success: true, message: 'Commission rule created', data: rule });
  }

  async getCommissionRules(req, res) {
    const rules = await commissionService.getCommissionRules();
    res.status(200).json({ success: true, data: rules });
  }

  // Budgets
  async createBudget(req, res) {
    const budget = await budgetService.createBudget(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Corporate budget created', data: budget });
  }

  async getBudgets(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'CLIENT' || req.user.role === 'WORKER') {
      filter.userId = req.user.id;
    }
    const budgets = await budgetService.getBudgets(filter);
    res.status(200).json({ success: true, data: budgets });
  }

  // Financial Reports
  async generateReport(req, res) {
    const report = await financeReportService.generateReport(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Financial report generated', data: report });
  }

  async getReports(req, res) {
    const reports = await financeReportService.getReports();
    res.status(200).json({ success: true, data: reports });
  }

  // Master Dashboard & AI Insights
  async getDashboardSummary(req, res) {
    const summary = await financeService.getDashboardSummary();
    res.status(200).json({ success: true, data: summary });
  }

  async getAIInsights(req, res) {
    const insights = await financeService.getAIAdvisoryFinancialInsights();
    res.status(200).json({ success: true, data: insights });
  }
}

module.exports = new FinanceController();
