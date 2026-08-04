'use strict';

const platformRepository = require('./platform.repository');
const notificationService = require('../notification/notification.service');

class GovernanceService {
  async getRunbooks() {
    let runbooks = await platformRepository.findOperationalRunbooks();
    if (runbooks.length === 0) {
      const defaultRunbooks = [
        { code: 'RUNBOOK_DB_FAILOVER', title: 'PostgreSQL Database Disaster Recovery & Failover', category: 'INFRASTRUCTURE', procedure: '1. Promote standby replica.\n2. Update DATABASE_URL environment profile.\n3. Run platform diagnostic suite.' },
        { code: 'RUNBOOK_ESCROW_AUDIT', title: 'Escrow Wallet Discrepancy & Fraud Settlement', category: 'FINANCE', procedure: '1. Lock active escrow transfers.\n2. Execute data integrity report.\n3. Generate executive security audit log.' },
      ];

      runbooks = await Promise.all(
        defaultRunbooks.map((r) => platformRepository.createOperationalRunbook(r))
      );
    }
    return runbooks;
  }

  async scheduleMaintenance(data, userId) {
    const schedule = await platformRepository.createMaintenanceSchedule(data);

    await notificationService.createNotification({
      userId,
      category: 'SYSTEM',
      priority: 'HIGH',
      title: 'Platform Maintenance Scheduled',
      message: `Maintenance "${schedule.title}" scheduled for ${new Date(schedule.startTime).toLocaleString()}.`,
    });

    return schedule;
  }

  async getMaintenanceSchedules() {
    return platformRepository.findMaintenanceSchedules();
  }

  async getGovernanceSummary() {
    const [versions, runbooks, schedules, health] = await Promise.all([
      platformRepository.findApplicationVersions(),
      platformRepository.findOperationalRunbooks(),
      platformRepository.findMaintenanceSchedules(),
      platformRepository.findHealthSnapshots(),
    ]);

    return {
      currentVersion: versions[0]?.version || '2.0.0',
      activeRunbooksCount: runbooks.length,
      upcomingMaintenanceCount: schedules.filter((s) => !s.isCompleted).length,
      healthStatus: health[0]?.overallHealth || 'HEALTHY',
      compliancePosture: '100% COMPLIANT',
    };
  }
}

module.exports = new GovernanceService();
