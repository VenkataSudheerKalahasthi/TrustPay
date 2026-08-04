const executiveAnalyticsRepository = require('./executiveAnalytics.repository');

class DashboardService {
  async getUserDashboards(userId) {
    const dashboards = await executiveAnalyticsRepository.findDashboardsByUserId(userId);
    if (dashboards.length === 0) {
      // Seed a default executive dashboard if user has none
      const defaultDash = await executiveAnalyticsRepository.createDashboard({
        userId,
        title: 'Main Executive Overview',
        type: 'EXECUTIVE',
        isDefault: true,
        layoutJson: JSON.stringify({ grid: '3-column-standard' }),
      });
      return [defaultDash];
    }
    return dashboards;
  }

  async getDashboardById(id) {
    return executiveAnalyticsRepository.findDashboardById(id);
  }

  async createDashboard(userId, data) {
    return executiveAnalyticsRepository.createDashboard({
      userId,
      title: data.title,
      type: data.type || 'EXECUTIVE',
      isDefault: data.isDefault || false,
      layoutJson: data.layoutJson || JSON.stringify({ grid: 'custom' }),
    });
  }

  async updateDashboard(id, data) {
    return executiveAnalyticsRepository.updateDashboard(id, data);
  }

  async deleteDashboard(id) {
    return executiveAnalyticsRepository.deleteDashboard(id);
  }

  async getTemplates() {
    return executiveAnalyticsRepository.findDashboardTemplates();
  }

  async addWidget(data) {
    return executiveAnalyticsRepository.createWidgetConfiguration(data);
  }

  async removeWidget(id) {
    return executiveAnalyticsRepository.deleteWidgetConfiguration(id);
  }
}

module.exports = new DashboardService();
