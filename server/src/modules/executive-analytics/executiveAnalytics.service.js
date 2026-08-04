const dashboardService = require('./dashboard.service');
const reportService = require('./report.service');
const chartService = require('./chart.service');
const executiveInsightService = require('./executiveInsight.service');
const executiveAnalyticsRepository = require('./executiveAnalytics.repository');

class ExecutiveAnalyticsService {
  // Master Overview
  async getExecutiveDashboardOverview(userId) {
    const dashboards = await dashboardService.getUserDashboards(userId);
    const primaryDashboard = dashboards[0];
    const revenueAnalytics = await chartService.getRevenueTrendAnalytics();
    const marketplaceAnalytics = await chartService.getMarketplaceAnalytics();
    const workforceAnalytics = await chartService.getWorkforceAnalytics();
    const supportAnalytics = await chartService.getSupportAnalytics();
    const comparativeMetrics = await chartService.getComparativeMetrics();
    const aiInsight = await executiveInsightService.getExecutiveInsightSummary();
    const kpiBenchmarks = await executiveAnalyticsRepository.findKPIBenchmarks();
    const alerts = await executiveAnalyticsRepository.findExecutiveAlerts();

    return {
      dashboard: primaryDashboard,
      revenueAnalytics,
      marketplaceAnalytics,
      workforceAnalytics,
      supportAnalytics,
      comparativeMetrics,
      aiInsight,
      kpiBenchmarks: kpiBenchmarks.length > 0 ? kpiBenchmarks : [
        { id: 'kpi_1', kpiCode: 'ESCROW_GROWTH', name: 'Escrow Volume Growth Rate', targetValue: 50.0, warningValue: 20.0, status: 'ABOVE_TARGET', unit: '%' },
        { id: 'kpi_2', kpiCode: 'SLA_COMPLIANCE', name: 'Support SLA Compliance', targetValue: 95.0, warningValue: 85.0, status: 'ABOVE_TARGET', unit: '%' },
      ],
      alerts: alerts.length > 0 ? alerts : [
        { id: 'alt_1', title: 'High Volume Withdrawal Check', metricKey: 'WALLETS', severity: 'MEDIUM', message: 'Escrow release exceeding ₹500,000 pending audit review', isRead: false },
      ],
    };
  }

  // Dashboards
  async getUserDashboards(userId) {
    return dashboardService.getUserDashboards(userId);
  }

  async createDashboard(userId, data) {
    return dashboardService.createDashboard(userId, data);
  }

  async updateDashboard(id, data) {
    return dashboardService.updateDashboard(id, data);
  }

  async deleteDashboard(id) {
    return dashboardService.deleteDashboard(id);
  }

  async addWidget(data) {
    return dashboardService.addWidget(data);
  }

  async removeWidget(id) {
    return dashboardService.removeWidget(id);
  }

  // Reports & Exports
  async getReports(visibility) {
    return reportService.getReports(visibility);
  }

  async getReportById(id) {
    return reportService.getReportById(id);
  }

  async createReport(authorId, data) {
    return reportService.createReport(authorId, data);
  }

  async exportReport(reportId, format) {
    return reportService.exportReport(reportId, format);
  }

  async getUserSubscriptions(userId) {
    return reportService.getUserSubscriptions(userId);
  }

  async createSubscription(userId, data) {
    return reportService.createSubscription(userId, data);
  }

  async getExecutionLogs() {
    return reportService.getExecutionLogs();
  }

  // Benchmarks & Alerts
  async getKPIBenchmarks() {
    const benchmarks = await executiveAnalyticsRepository.findKPIBenchmarks();
    if (benchmarks.length === 0) {
      const b1 = await executiveAnalyticsRepository.upsertKPIBenchmark('ESCROW_GROWTH', {
        name: 'Escrow Volume Growth Rate',
        targetValue: 50.0,
        warningValue: 20.0,
        status: 'ABOVE_TARGET',
        unit: '%',
      });
      const b2 = await executiveAnalyticsRepository.upsertKPIBenchmark('SLA_COMPLIANCE', {
        name: 'Support SLA Compliance',
        targetValue: 95.0,
        warningValue: 85.0,
        status: 'ABOVE_TARGET',
        unit: '%',
      });
      return [b1, b2];
    }
    return benchmarks;
  }

  async upsertKPIBenchmark(kpiCode, data) {
    return executiveAnalyticsRepository.upsertKPIBenchmark(kpiCode, data);
  }

  async getExecutiveAlerts() {
    return executiveAnalyticsRepository.findExecutiveAlerts();
  }

  async createExecutiveAlert(data) {
    return executiveAnalyticsRepository.createExecutiveAlert(data);
  }

  // Charts & Insights
  async getRevenueTrendAnalytics() {
    return chartService.getRevenueTrendAnalytics();
  }

  async getMarketplaceAnalytics() {
    return chartService.getMarketplaceAnalytics();
  }

  async getWorkforceAnalytics() {
    return chartService.getWorkforceAnalytics();
  }

  async getSupportAnalytics() {
    return chartService.getSupportAnalytics();
  }

  async getAIExecutiveInsight(reportKey) {
    return executiveInsightService.getExecutiveInsightSummary(reportKey);
  }
}

module.exports = new ExecutiveAnalyticsService();
