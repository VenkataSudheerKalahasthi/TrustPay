'use strict';

const analyticsRepository = require('./analytics.repository');
const prisma = require('../../config/database');
const { AuthorizationError, NotFoundError } = require('../../utils/ApiError');

class AnalyticsService {
  /**
   * Get Client Analytics Dashboard Data
   */
  async getClientDashboard(userId, dateRange = 'MONTHLY', startDate = null, endDate = null) {
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile) {
      throw new NotFoundError('Client Profile');
    }

    const metrics = await analyticsRepository.getClientMetrics(
      clientProfile.id,
      dateRange,
      startDate,
      endDate
    );

    const trends = await analyticsRepository.getTimeSeriesTrends(dateRange);

    return {
      role: 'CLIENT',
      dateRange,
      metrics,
      trends,
    };
  }

  /**
   * Get Worker Analytics Dashboard Data
   */
  async getWorkerDashboard(userId, dateRange = 'MONTHLY', startDate = null, endDate = null) {
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
    });

    if (!workerProfile) {
      throw new NotFoundError('Worker Profile');
    }

    const metrics = await analyticsRepository.getWorkerMetrics(
      workerProfile.id,
      dateRange,
      startDate,
      endDate
    );

    const trends = await analyticsRepository.getTimeSeriesTrends(dateRange);

    const radarMetrics = [
      { subject: 'Milestone Speed', A: 90, fullMark: 100 },
      { subject: 'Code Quality', A: 95, fullMark: 100 },
      { subject: 'Communication', A: 88, fullMark: 100 },
      { subject: 'Contract Compliance', A: 98, fullMark: 100 },
      { subject: 'Evidence Integrity', A: 100, fullMark: 100 },
    ];

    return {
      role: 'WORKER',
      dateRange,
      metrics,
      trends,
      radarMetrics,
    };
  }

  /**
   * Get Admin Analytics Dashboard Data
   */
  async getAdminDashboard(userId, role, dateRange = 'MONTHLY', startDate = null, endDate = null) {
    if (role !== 'ADMIN') {
      throw new AuthorizationError('Admin role privileges required for platform analytics');
    }

    const metrics = await analyticsRepository.getAdminPlatformMetrics(dateRange, startDate, endDate);
    const trends = await analyticsRepository.getTimeSeriesTrends(dateRange);

    return {
      role: 'ADMIN',
      dateRange,
      metrics,
      trends,
    };
  }
}

module.exports = new AnalyticsService();
