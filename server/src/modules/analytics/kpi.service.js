'use strict';

const analyticsRepository = require('./analytics.repository');
const notificationService = require('../notification/notification.service');

class KPIService {
  async createKPIDefinition(data) {
    return analyticsRepository.createKPIDefinition(data);
  }

  async getKPIDefinitions() {
    let kpis = await analyticsRepository.findKPIDefinitions();
    if (kpis.length === 0) {
      const defaultKPIs = [
        { code: 'KPI_MRR', name: 'Monthly Recurring Revenue (MRR)', category: 'FINANCE', unit: 'INR', targetValue: 200000, currentValue: 150000, trend: 'UP' },
        { code: 'KPI_UTILIZATION', name: 'Workforce Capacity Utilization', category: 'WORKFORCE', unit: '%', targetValue: 85.0, currentValue: 78.5, trend: 'STABLE' },
        { code: 'KPI_CSAT', name: 'Customer Satisfaction Score (CSAT)', category: 'SUPPORT', unit: '/5', targetValue: 4.8, currentValue: 4.6, trend: 'UP' },
        { code: 'KPI_GMV', name: 'Gross Marketplace Volume (GMV)', category: 'MARKETPLACE', unit: 'INR', targetValue: 5000000, currentValue: 3800000, trend: 'UP' },
      ];

      kpis = await Promise.all(
        defaultKPIs.map((d) => analyticsRepository.createKPIDefinition(d))
      );
    }
    return kpis;
  }

  async updateKPIValue(kpiId, value, userId) {
    const kpi = await analyticsRepository.recordKPIValue(kpiId, value);

    if (kpi.value < kpi.targetValue * 0.8) {
      await notificationService.createNotification({
        userId,
        category: 'SYSTEM',
        priority: 'HIGH',
        title: `KPI Threshold Alert: ${kpi.name}`,
        message: `KPI value ${kpi.value} is below target threshold of ${kpi.targetValue}.`,
      });
    }

    return kpi;
  }
}

module.exports = new KPIService();
