'use strict';

const analyticsRepository = require('./analytics.repository');

class DashboardService {
  async createDashboard(data, userId) {
    return analyticsRepository.createDashboard(data, userId);
  }

  async getDashboardsByUser(userId) {
    let dashboards = await analyticsRepository.findDashboardsByUser(userId);
    if (dashboards.length === 0) {
      const defaultDashboard = await analyticsRepository.createDashboard(
        {
          title: 'C-Suite Executive Overview',
          description: 'Master executive decision intelligence view across platform finance, workforce, and marketplace.',
          visibility: 'ORGANIZATION',
          isDefault: true,
        },
        userId
      );
      dashboards = [defaultDashboard];
    }
    return dashboards;
  }

  async addWidget(data) {
    return analyticsRepository.createWidget(data);
  }
}

module.exports = new DashboardService();
