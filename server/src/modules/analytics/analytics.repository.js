'use strict';

const { prisma } = require('../../config/database');

class AnalyticsRepository {
  // ─── Executive Dashboards & Widgets ──────────────────────────
  async createDashboard(data, userId) {
    return prisma.executiveDashboard.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
        visibility: data.visibility || 'PRIVATE',
        isDefault: data.isDefault || false,
      },
      include: {
        widgets: true,
        layouts: true,
      },
    });
  }

  async findDashboardsByUser(userId) {
    return prisma.executiveDashboard.findMany({
      where: {
        OR: [{ userId }, { visibility: 'ORGANIZATION' }, { visibility: 'ADMIN' }],
      },
      include: {
        widgets: true,
        layouts: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createWidget(data) {
    return prisma.dashboardWidget.create({
      data: {
        dashboardId: data.dashboardId,
        title: data.title,
        type: data.type || 'KPI',
        metricKey: data.metricKey,
        configJson: data.configJson,
        gridX: data.gridX || 0,
        gridY: data.gridY || 0,
        gridW: data.gridW || 4,
        gridH: data.gridH || 3,
      },
    });
  }

  // ─── KPI Engine & Values ─────────────────────────────────────
  async createKPIDefinition(data) {
    return prisma.kpiDefinition.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        category: data.category || 'FINANCE',
        unit: data.unit || 'INR',
        targetValue: data.targetValue,
        currentValue: data.currentValue || 0.0,
        trend: data.trend || 'STABLE',
      },
    });
  }

  async findKPIDefinitions() {
    return prisma.kpiDefinition.findMany({
      include: {
        values: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recordKPIValue(kpiDefinitionId, value) {
    return prisma.kpiValue.create({
      data: {
        kpiDefinitionId,
        value,
      },
    });
  }

  // ─── Forecast Models & Results ──────────────────────────────
  async createForecastModel(data) {
    return prisma.forecastModel.create({
      data: {
        name: data.name,
        type: data.type || 'REVENUE',
        algorithm: data.algorithm || 'LINEAR_REGRESSION',
        confidence: data.confidence || 95.0,
      },
      include: {
        results: true,
      },
    });
  }

  async findForecastModels() {
    return prisma.forecastModel.findMany({
      include: {
        results: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createForecastResult(modelId, periodLabel, projectedValue, lowerBound, upperBound) {
    return prisma.forecastResult.create({
      data: {
        forecastModelId: modelId,
        periodLabel,
        projectedValue,
        lowerBound,
        upperBound,
      },
    });
  }

  // ─── Executive Reports & Schedules ────────────────────────────
  async createExecutiveReport(data, userId) {
    return prisma.executiveReport.create({
      data: {
        reportNumber: `EXEC-REP-${Date.now()}`,
        title: data.title,
        summary: data.summary,
        dataPayload: data.dataPayload ? JSON.stringify(data.dataPayload) : null,
        generatedById: userId,
      },
    });
  }

  async findExecutiveReports() {
    return prisma.executiveReport.findMany({
      include: {
        generatedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReportSchedule(data) {
    return prisma.reportSchedule.create({
      data: {
        title: data.title,
        frequency: data.frequency || 'WEEKLY',
        recipients: data.recipients || [],
        nextRunAt: new Date(data.nextRunAt),
      },
    });
  }

  async findReportSchedules() {
    return prisma.reportSchedule.findMany({
      orderBy: { nextRunAt: 'asc' },
    });
  }

  // ─── Scorecards ──────────────────────────────────────────────
  async findScorecards() {
    return prisma.scorecard.findMany({
      include: {
        metrics: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createScorecard(data) {
    return prisma.scorecard.create({
      data: {
        title: data.title,
        department: data.department || 'EXECUTIVE',
        overallScore: data.overallScore || 100.0,
        metrics: {
          create: data.metrics || [],
        },
      },
      include: {
        metrics: true,
      },
    });
  }

  // ─── Business Goals & Progress Logs ──────────────────────────
  async createBusinessGoal(data, ownerUserId) {
    return prisma.businessGoal.create({
      data: {
        title: data.title,
        description: data.description,
        ownerUserId,
        targetValue: data.targetValue,
        currentValue: data.currentValue || 0.0,
        unit: data.unit || 'INR',
        status: data.status || 'ON_TRACK',
        startDate: new Date(data.startDate),
        targetDate: new Date(data.targetDate),
      },
      include: {
        progressLogs: true,
      },
    });
  }

  async findBusinessGoals() {
    return prisma.businessGoal.findMany({
      include: {
        ownerUser: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        progressLogs: {
          orderBy: { loggedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async logGoalProgress(goalId, value, notes) {
    return prisma.goalProgress.create({
      data: {
        businessGoalId: goalId,
        value,
        notes,
      },
    });
  }

  // ─── Decision Insights ───────────────────────────────────────
  async findInsightRecommendations() {
    return prisma.insightRecommendation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createInsightRecommendation(data) {
    return prisma.insightRecommendation.create({
      data: {
        title: data.title,
        category: data.category || 'EXECUTIVE',
        priority: data.priority || 'MEDIUM',
        observation: data.observation,
        suggestion: data.suggestion,
      },
    });
  }
}

module.exports = new AnalyticsRepository();
