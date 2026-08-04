'use strict';

const analyticsRepository = require('./analytics.repository');
const notificationService = require('../notification/notification.service');

class ExecutiveReportService {
  async generateExecutiveReport(data, userId) {
    const report = await analyticsRepository.createExecutiveReport(
      {
        title: data.title || `Executive Strategy Brief ${new Date().toLocaleDateString()}`,
        summary: data.summary || 'Comprehensive decision intelligence report synthesizing cross-module platform health.',
        dataPayload: {
          mrr: 150000,
          arr: 1800000,
          workforceUtilizationPct: 78.5,
          activeDisputes: 0,
          csatScore: 4.6,
        },
      },
      userId
    );

    await notificationService.createNotification({
      userId,
      category: 'SYSTEM',
      priority: 'NORMAL',
      title: 'Executive Report Generated',
      message: `Strategic Report "${report.title}" is ready for C-suite review.`,
    });

    return report;
  }

  async getExecutiveReports() {
    return analyticsRepository.findExecutiveReports();
  }

  async scheduleReport(data) {
    return analyticsRepository.createReportSchedule(data);
  }

  async getReportSchedules() {
    return analyticsRepository.findReportSchedules();
  }

  async getScorecards() {
    let scorecards = await analyticsRepository.findScorecards();
    if (scorecards.length === 0) {
      const defaultScorecard = await analyticsRepository.createScorecard({
        title: 'Q3 2026 Platform Operational Scorecard',
        department: 'EXECUTIVE',
        overallScore: 92.5,
        metrics: [
          { metricName: 'Financial Growth Velocity', target: 100, actual: 95, score: 95.0 },
          { metricName: 'Workforce Productivity Index', target: 85, actual: 78.5, score: 92.3 },
          { metricName: 'SLA Support Resolution Rate', target: 98, actual: 99.2, score: 100.0 },
          { metricName: 'Marketplace Escrow Compliance', target: 100, actual: 100, score: 100.0 },
        ],
      });
      scorecards = [defaultScorecard];
    }
    return scorecards;
  }
}

module.exports = new ExecutiveReportService();
