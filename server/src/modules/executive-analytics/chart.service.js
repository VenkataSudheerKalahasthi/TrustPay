class ChartService {
  async getRevenueTrendAnalytics() {
    return {
      title: 'Quarterly Revenue & Profitability Trend',
      chartType: 'AREA_CHART',
      series: [
        { label: 'Escrow Volume', data: [1200000, 1800000, 2400000, 3100000] },
        { label: 'Net Platform Commission', data: [60000, 90000, 120000, 155000] },
        { label: 'Enterprise Subscriptions', data: [45000, 65000, 95000, 140000] },
      ],
      categories: ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026 (Projected)'],
    };
  }

  async getMarketplaceAnalytics() {
    return {
      title: 'Marketplace Hiring & Contract Growth',
      chartType: 'BAR_CHART',
      series: [
        { label: 'Jobs Posted', data: [45, 68, 92, 120] },
        { label: 'Contracts Executed', data: [38, 55, 84, 110] },
        { label: 'Milestones Completed', data: [110, 180, 260, 340] },
      ],
      categories: ['Jan', 'Feb', 'Mar', 'Apr'],
    };
  }

  async getWorkforceAnalytics() {
    return {
      title: 'Workforce Productivity & Utilization Rate',
      chartType: 'LINE_CHART',
      series: [
        { label: 'Active Contingent Workers', data: [150, 180, 220, 290] },
        { label: 'Avg Productivity Score (%)', data: [88, 91, 93, 95] },
      ],
      categories: ['Jan', 'Feb', 'Mar', 'Apr'],
    };
  }

  async getSupportAnalytics() {
    return {
      title: 'Support SLA & Ticket Resolution Volume',
      chartType: 'PIE_CHART',
      series: [
        { label: 'Resolved within SLA', value: 84 },
        { label: 'Escalated / Disputed', value: 12 },
        { label: 'Pending Review', value: 4 },
      ],
    };
  }

  async getComparativeMetrics() {
    return [
      { metricKey: 'GROSS_VOLUME', previousValue: 4500000, currentValue: 6800000, changePercent: 51.1 },
      { metricKey: 'ACTIVE_USERS', previousValue: 1200, currentValue: 1850, changePercent: 54.1 },
      { metricKey: 'NET_COMMISSION', previousValue: 225000, currentValue: 340000, changePercent: 51.1 },
      { metricKey: 'CSAT_SCORE', previousValue: 4.6, currentValue: 4.9, changePercent: 6.5 },
    ];
  }
}

module.exports = new ChartService();
