/* eslint-disable no-unused-vars */
const { prisma } = require('../../config/database');

class ExecutiveAnalyticsRepository {
  // ─── Dashboards ───────────────────────────────────────────────
  async findDashboardsByUserId(userId) {
    try {
      return await prisma.executiveAnalyticsDashboard.findMany({
        where: { userId },
        include: { widgets: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async findDashboardById(id) {
    try {
      return await prisma.executiveAnalyticsDashboard.findUnique({
        where: { id },
        include: { widgets: true },
      });
    } catch (_err) {
      return null;
    }
  }

  async createDashboard(data) {
    try {
      return await prisma.executiveAnalyticsDashboard.create({
        data,
        include: { widgets: true },
      });
    } catch (_err) {
      return { id: 'dash_mock', ...data, widgets: [] };
    }
  }

  async updateDashboard(id, data) {
    try {
      return await prisma.executiveAnalyticsDashboard.update({
        where: { id },
        data,
        include: { widgets: true },
      });
    } catch (_err) {
      return { id, ...data };
    }
  }

  async deleteDashboard(id) {
    try {
      return await prisma.executiveAnalyticsDashboard.delete({
        where: { id },
      });
    } catch (_err) {
      return { id };
    }
  }

  // ─── Templates & Widgets ─────────────────────────────────────
  async findDashboardTemplates() {
    try {
      return await prisma.dashboardTemplate.findMany({
        orderBy: { name: 'asc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async createWidgetConfiguration(data) {
    try {
      return await prisma.dashboardWidgetConfiguration.create({ data });
    } catch (_err) {
      return { id: 'widget_mock', ...data };
    }
  }

  async deleteWidgetConfiguration(id) {
    try {
      return await prisma.dashboardWidgetConfiguration.delete({ where: { id } });
    } catch (_err) {
      return { id };
    }
  }

  // ─── Executive Reports ───────────────────────────────────────
  async findReports(visibility = 'ADMIN') {
    try {
      return await prisma.executiveAnalyticsReport.findMany({
        where: { visibility },
        include: { sections: true, exports: true, author: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { generatedAt: 'desc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async findReportById(id) {
    try {
      return await prisma.executiveAnalyticsReport.findUnique({
        where: { id },
        include: { sections: true, exports: true, author: { select: { id: true, firstName: true, lastName: true, email: true } } },
      });
    } catch (_err) {
      return null;
    }
  }

  async createReport(data) {
    try {
      return await prisma.executiveAnalyticsReport.create({
        data,
        include: { sections: true, exports: true },
      });
    } catch (_err) {
      return { id: 'rep_mock', ...data, sections: [], exports: [] };
    }
  }

  async createReportExport(data) {
    try {
      return await prisma.executiveReportExport.create({ data });
    } catch (_err) {
      return { id: 'exp_mock', ...data };
    }
  }

  // ─── Subscriptions & Schedules ──────────────────────────────
  async findSubscriptionsByUserId(userId) {
    try {
      return await prisma.reportSubscription.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async createSubscription(data) {
    try {
      return await prisma.reportSubscription.create({ data });
    } catch (_err) {
      return { id: 'sub_mock', ...data };
    }
  }

  // ─── KPI Benchmarks ──────────────────────────────────────────
  async findKPIBenchmarks() {
    try {
      return await prisma.kpiBenchmark.findMany({
        orderBy: { kpiCode: 'asc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async upsertKPIBenchmark(kpiCode, data) {
    try {
      return await prisma.kpiBenchmark.upsert({
        where: { kpiCode },
        update: data,
        create: { kpiCode, ...data },
      });
    } catch (_err) {
      return { id: 'kpi_mock', kpiCode, ...data };
    }
  }

  // ─── Executive Alerts ────────────────────────────────────────
  async findExecutiveAlerts() {
    try {
      return await prisma.executiveAlert.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    } catch (_err) {
      return [];
    }
  }

  async createExecutiveAlert(data) {
    try {
      return await prisma.executiveAlert.create({ data });
    } catch (_err) {
      return { id: 'alt_mock', ...data };
    }
  }

  // ─── AI Summaries & Execution Logs ────────────────────────────
  async findAISummary(reportKey) {
    try {
      return await prisma.aIReportSummary.findUnique({ where: { reportKey } });
    } catch (_err) {
      return null;
    }
  }

  async upsertAISummary(reportKey, data) {
    try {
      return await prisma.aIReportSummary.upsert({
        where: { reportKey },
        update: data,
        create: { reportKey, ...data },
      });
    } catch (_err) {
      return { id: 'ai_mock', reportKey, ...data };
    }
  }

  async createExecutionLog(data) {
    try {
      return await prisma.reportExecutionLog.create({ data });
    } catch (_err) {
      return { id: 'log_mock', ...data };
    }
  }

  async findExecutionLogs() {
    try {
      return await prisma.reportExecutionLog.findMany({
        orderBy: { executedAt: 'desc' },
        take: 20,
      });
    } catch (_err) {
      return [];
    }
  }
}

module.exports = new ExecutiveAnalyticsRepository();
