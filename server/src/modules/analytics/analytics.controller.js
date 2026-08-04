'use strict';

const analyticsService = require('./analytics.service');
const dashboardService = require('./dashboard.service');
const reportService = require('./report.service');
const kpiService = require('./kpi.service');
const forecastService = require('./forecast.service');
const executiveReportService = require('./executiveReport.service');
const decisionInsightService = require('./decisionInsight.service');
const ApiResponse = require('../../utils/ApiResponse');

class AnalyticsController {
  // ─── Existing Analytics Dashboard & Preferences ──────────────
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const { dateRange, startDate, endDate } = req.query;

      let data;
      if (role === 'CLIENT') {
        data = await analyticsService.getClientDashboard(userId, dateRange, startDate, endDate);
      } else if (role === 'WORKER') {
        data = await analyticsService.getWorkerDashboard(userId, dateRange, startDate, endDate);
      } else if (role === 'ADMIN') {
        data = await analyticsService.getAdminDashboard(userId, role, dateRange, startDate, endDate);
      } else {
        data = await analyticsService.getClientDashboard(userId, dateRange, startDate, endDate);
      }

      return ApiResponse.success(res, data, 'Analytics dashboard data retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getPreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const pref = await dashboardService.getPreference(userId);
      return ApiResponse.success(res, pref, 'Dashboard preferences retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const pref = await dashboardService.updatePreference(userId, req.body);
      return ApiResponse.success(res, pref, 'Dashboard preferences updated');
    } catch (err) {
      next(err);
    }
  }

  async exportReport(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const { reportType = 'FINANCIAL', format = 'PDF', ...filters } = req.body;

      if (format === 'PDF') {
        const pdfBuffer = await reportService.generatePDFReport(userId, role, reportType, filters);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=TrustPay_Report_${Date.now()}.pdf`);
        return res.send(pdfBuffer);
      }

      if (format === 'CSV') {
        const csvText = await reportService.generateCSVReport(userId, role, reportType, filters);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=TrustPay_Report_${Date.now()}.csv`);
        return res.send(csvText);
      }

      if (format === 'EXCEL') {
        const excelText = await reportService.generateExcelReport(userId, role, reportType, filters);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', `attachment; filename=TrustPay_Report_${Date.now()}.xls`);
        return res.send(excelText);
      }

      return ApiResponse.error(res, 'Unsupported export format', 400);
    } catch (err) {
      next(err);
    }
  }

  // ─── Phase 4 Part 6: Executive BI & Decision Intelligence ────

  // Executive Dashboards
  async getExecutiveDashboards(req, res, next) {
    try {
      const dashboards = await dashboardService.getDashboardsByUser(req.user.id);
      return ApiResponse.success(res, dashboards, 'Executive dashboards retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createExecutiveDashboard(req, res, next) {
    try {
      const dashboard = await dashboardService.createDashboard(req.body, req.user.id);
      return ApiResponse.success(res, dashboard, 'Executive dashboard created', 201);
    } catch (err) {
      next(err);
    }
  }

  async addDashboardWidget(req, res, next) {
    try {
      const widget = await dashboardService.addWidget(req.body);
      return ApiResponse.success(res, widget, 'Dashboard widget added', 201);
    } catch (err) {
      next(err);
    }
  }

  // KPIs
  async getKPIs(req, res, next) {
    try {
      const kpis = await kpiService.getKPIDefinitions();
      return ApiResponse.success(res, kpis, 'KPI definitions retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createKPI(req, res, next) {
    try {
      const kpi = await kpiService.createKPIDefinition(req.body);
      return ApiResponse.success(res, kpi, 'KPI definition created', 201);
    } catch (err) {
      next(err);
    }
  }

  // Forecasts
  async getForecasts(req, res, next) {
    try {
      const forecasts = await forecastService.getForecastModels();
      return ApiResponse.success(res, forecasts, 'Forecast models retrieved');
    } catch (err) {
      next(err);
    }
  }

  async generateForecast(req, res, next) {
    try {
      const forecast = await forecastService.generateForecast(req.body);
      return ApiResponse.success(res, forecast, 'Predictive forecast generated', 201);
    } catch (err) {
      next(err);
    }
  }

  // Executive Reports & Schedules
  async getExecutiveReports(req, res, next) {
    try {
      const reports = await executiveReportService.getExecutiveReports();
      return ApiResponse.success(res, reports, 'Executive reports retrieved');
    } catch (err) {
      next(err);
    }
  }

  async generateExecutiveReport(req, res, next) {
    try {
      const report = await executiveReportService.generateExecutiveReport(req.body, req.user.id);
      return ApiResponse.success(res, report, 'Executive report generated', 201);
    } catch (err) {
      next(err);
    }
  }

  async getReportSchedules(req, res, next) {
    try {
      const schedules = await executiveReportService.getReportSchedules();
      return ApiResponse.success(res, schedules, 'Report schedules retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createReportSchedule(req, res, next) {
    try {
      const schedule = await executiveReportService.scheduleReport(req.body);
      return ApiResponse.success(res, schedule, 'Report schedule created', 201);
    } catch (err) {
      next(err);
    }
  }

  // Scorecards
  async getScorecards(req, res, next) {
    try {
      const scorecards = await executiveReportService.getScorecards();
      return ApiResponse.success(res, scorecards, 'Operational scorecards retrieved');
    } catch (err) {
      next(err);
    }
  }

  // Business Goals
  async getBusinessGoals(req, res, next) {
    try {
      const analyticsRepository = require('./analytics.repository');
      const goals = await analyticsRepository.findBusinessGoals();
      return ApiResponse.success(res, goals, 'Business goals retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createBusinessGoal(req, res, next) {
    try {
      const analyticsRepository = require('./analytics.repository');
      const goal = await analyticsRepository.createBusinessGoal(req.body, req.user.id);
      return ApiResponse.success(res, goal, 'Business goal created', 201);
    } catch (err) {
      next(err);
    }
  }

  async logGoalProgress(req, res, next) {
    try {
      const analyticsRepository = require('./analytics.repository');
      const progress = await analyticsRepository.logGoalProgress(req.params.goalId, req.body.value, req.body.notes);
      return ApiResponse.success(res, progress, 'Goal progress logged', 201);
    } catch (err) {
      next(err);
    }
  }

  // Decision Insights
  async getDecisionInsights(req, res, next) {
    try {
      const insights = await decisionInsightService.getExecutiveSummarySynthesis();
      return ApiResponse.success(res, insights, 'AI decision insights retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
