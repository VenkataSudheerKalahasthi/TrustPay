'use strict';

const financeRepository = require('./finance.repository');
const notificationService = require('../notification/notification.service');

class FinanceReportService {
  async generateReport(data, userId) {
    const [revenueEntries, expenseEntries] = await Promise.all([
      financeRepository.findRevenueEntries(),
      financeRepository.findExpenseEntries(),
    ]);

    const totalRevenue = revenueEntries.reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = expenseEntries.reduce((sum, e) => sum + e.amount, 0);

    const report = await financeRepository.createFinancialReport(
      {
        title: data.title,
        reportType: data.reportType || 'PROFIT_LOSS',
        startDate: data.startDate,
        endDate: data.endDate,
        totalRevenue,
        totalExpense,
        summaryData: {
          revenueCategoryCount: revenueEntries.length,
          expenseCategoryCount: expenseEntries.length,
          profitMarginPct: totalRevenue > 0 ? Math.round(((totalRevenue - totalExpense) / totalRevenue) * 1000) / 10 : 0,
        },
      },
      userId
    );

    await notificationService.createNotification({
      userId,
      category: 'BILLING',
      priority: 'NORMAL',
      title: `Financial Report Generated`,
      message: `Report "${report.title}" (${report.reportType}) is ready for download.`,
    });

    return report;
  }

  async getReports() {
    return financeRepository.findFinancialReports();
  }
}

module.exports = new FinanceReportService();
