'use strict';

const prisma = require('../../config/database');

class OperationRepository {
  async getOperations() {
    return prisma.systemOperation.findMany({
      orderBy: { executedAt: 'desc' },
      take: 20,
      include: { logs: { take: 5 } },
    });
  }

  async createOperation(name, category = 'BACKGROUND_JOB') {
    return prisma.systemOperation.create({
      data: { name, category, status: 'SUCCESS' },
    });
  }

  async getBackupJobs() {
    return prisma.backupJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: { histories: { take: 5 } },
    });
  }

  async getComplianceReports() {
    return prisma.complianceReport.findMany({
      orderBy: { generatedAt: 'desc' },
    });
  }

  async getDataExportRequests(userId) {
    return prisma.dataExportRequest.findMany({
      where: userId ? { userId } : {},
      orderBy: { requestedAt: 'desc' },
    });
  }

  async createExportRequest(userId) {
    return prisma.dataExportRequest.create({
      data: {
        userId,
        status: 'COMPLETED',
        downloadUrl: `https://app.trustpay.com/api/v1/compliance/export/download/${Date.now()}.json`,
      },
    });
  }
}

module.exports = new OperationRepository();
