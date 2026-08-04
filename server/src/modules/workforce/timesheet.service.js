'use strict';

const workforceRepository = require('./workforce.repository');

class TimesheetService {
  /**
   * Worker Clock In
   */
  async clockIn(workerUserId, data) {
    const existingActive = await workforceRepository.findActiveTimeEntry(workerUserId);
    if (existingActive) {
      throw new Error('Worker already has an active clock-in session.');
    }

    return workforceRepository.createTimeEntry({
      workerUserId,
      projectId: data.projectId,
      contractId: data.contractId,
      workShiftId: data.workShiftId,
      isBillable: data.isBillable,
      notes: data.notes,
      hourlyRate: data.hourlyRate,
      clockIn: new Date(),
    });
  }

  /**
   * Worker Clock Out
   */
  async clockOut(workerUserId, data) {
    const activeEntry = await workforceRepository.findActiveTimeEntry(workerUserId);
    if (!activeEntry) {
      throw new Error('No active clock-in session found for this worker.');
    }

    const clockOutTime = new Date();
    const breakMins = data.breakMinutes !== undefined ? data.breakMinutes : activeEntry.breakMinutes || 0;

    return workforceRepository.updateTimeEntry(activeEntry.id, {
      clockOut: clockOutTime,
      breakMinutes: breakMins,
      notes: data.notes || activeEntry.notes,
    });
  }

  /**
   * Pause/Resume session (updates break minutes or notes)
   */
  async pauseOrResume(workerUserId, data) {
    const activeEntry = await workforceRepository.findActiveTimeEntry(workerUserId);
    if (!activeEntry) {
      throw new Error('No active clock-in session found.');
    }

    const updatedBreakMinutes = (activeEntry.breakMinutes || 0) + (data.breakMinutes || 0);

    return workforceRepository.updateTimeEntry(activeEntry.id, {
      breakMinutes: updatedBreakMinutes,
      notes: data.notes ? `${activeEntry.notes || ''} [Pause: ${data.notes}]` : activeEntry.notes,
    });
  }

  /**
   * Get Active Entry for worker
   */
  async getActiveEntry(workerUserId) {
    return workforceRepository.findActiveTimeEntry(workerUserId);
  }

  /**
   * Get Time Entries list
   */
  async getTimeEntries(filter = {}) {
    return workforceRepository.findTimeEntries(filter);
  }

  /**
   * Submit Timesheet for approval
   */
  async submitTimesheet(workerUserId, data) {
    // Calculate total billable & overtime hours for the period
    const entries = await workforceRepository.findTimeEntries({
      workerUserId,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    let totalHours = 0;
    let billableHours = 0;

    entries.forEach((e) => {
      if (e.clockIn && e.clockOut) {
        const diffMs = new Date(e.clockOut) - new Date(e.clockIn);
        const hours = Math.max(0, diffMs / (1000 * 60 * 60) - (e.breakMinutes || 0) / 60);
        totalHours += hours;
        if (e.isBillable) {
          billableHours += hours;
        }
      }
    });

    const overtimeHours = Math.max(0, totalHours - 40);

    return workforceRepository.createTimesheet({
      workerUserId,
      organizationId: data.organizationId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'SUBMITTED',
      totalHours: Math.round(totalHours * 100) / 100,
      billableHours: Math.round(billableHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      notes: data.notes,
    });
  }

  /**
   * Find Timesheets
   */
  async getTimesheets(filter = {}) {
    return workforceRepository.findTimesheets(filter);
  }

  /**
   * Approve or Reject Timesheet
   */
  async reviewTimesheet(timesheetId, approvedById, data) {
    return workforceRepository.updateTimesheet(timesheetId, {
      status: data.status,
      approvedById,
      notes: data.notes,
    });
  }
}

module.exports = new TimesheetService();
