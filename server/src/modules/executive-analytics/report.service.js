const executiveAnalyticsRepository = require('./executiveAnalytics.repository');

class ReportService {
  async getReports(visibility = 'ADMIN') {
    return executiveAnalyticsRepository.findReports(visibility);
  }

  async getReportById(id) {
    return executiveAnalyticsRepository.findReportById(id);
  }

  async createReport(authorId, data) {
    const reportNumber = `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newReport = await executiveAnalyticsRepository.createReport({
      reportNumber,
      title: data.title,
      visibility: data.visibility || 'ADMIN',
      authorId,
      summary: data.summary || 'Automated executive summary generated for strategic review.',
      dataJson: JSON.stringify(data.metrics || {}),
      sections: data.sections ? {
        create: data.sections.map((s, idx) => ({
          title: s.title,
          orderIndex: s.orderIndex ?? idx,
          contentJson: s.contentJson,
        }))
      } : undefined,
    });

    await executiveAnalyticsRepository.createExecutionLog({
      reportName: data.title,
      status: 'COMPLETED',
      durationMs: Math.floor(Math.random() * 200) + 50,
    });

    return newReport;
  }

  async exportReport(reportId, format) {
    const exportRecord = await executiveAnalyticsRepository.createReportExport({
      reportId,
      format,
      fileUrl: `https://storage.trustpay.internal/exports/report_${reportId}.${format.toLowerCase()}`,
      status: 'COMPLETED',
    });
    return exportRecord;
  }

  async getUserSubscriptions(userId) {
    return executiveAnalyticsRepository.findSubscriptionsByUserId(userId);
  }

  async createSubscription(userId, data) {
    const nextRun = new Date();
    nextRun.setDate(nextRun.getDate() + (data.frequency === 'DAILY' ? 1 : data.frequency === 'MONTHLY' ? 30 : 7));

    return executiveAnalyticsRepository.createSubscription({
      userId,
      frequency: data.frequency || 'WEEKLY',
      format: data.format || 'PDF',
      email: data.email,
      isActive: true,
      nextRunAt: nextRun,
    });
  }

  async getExecutionLogs() {
    return executiveAnalyticsRepository.findExecutionLogs();
  }
}

module.exports = new ReportService();
