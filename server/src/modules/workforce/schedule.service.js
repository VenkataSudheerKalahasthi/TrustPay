'use strict';

const workforceRepository = require('./workforce.repository');

class ScheduleService {
  /**
   * Create a schedule with optional shift templates
   */
  async createSchedule(data) {
    return workforceRepository.createSchedule(data);
  }

  /**
   * Get schedules with filters
   */
  async getSchedules(filter = {}) {
    return workforceRepository.findSchedules(filter);
  }

  /**
   * Create shift with conflict detection and availability validation
   */
  async createShift(data) {
    // 1. Conflict detection for worker shifts if worker assigned
    if (data.assignedUserId) {
      const existingShifts = await workforceRepository.findShifts({
        assignedUserId: data.assignedUserId,
      });

      const hasConflict = existingShifts.some((shift) => {
        if (shift.status === 'CANCELLED') {
          return false;
        }
        // Check day overlap and time overlap
        const daysA = JSON.parse(shift.daysOfWeek || '[]');
        const daysB = JSON.parse(data.daysOfWeek || '[]');
        const dayOverlap = daysA.some((d) => daysB.includes(d));
        if (!dayOverlap) {
          return false;
        }

        return this._isTimeOverlapping(shift.startTime, shift.endTime, data.startTime, data.endTime);
      });

      if (hasConflict) {
        throw new Error('Shift time conflicts with an existing assigned shift for this worker.');
      }
    }

    return workforceRepository.createShift(data);
  }

  /**
   * Check if two time windows overlap (Format HH:mm)
   */
  _isTimeOverlapping(startA, endA, startB, endB) {
    const toMins = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const sA = toMins(startA);
    const eA = toMins(endA);
    const sB = toMins(startB);
    const eB = toMins(endB);

    return Math.max(sA, sB) < Math.min(eA, eB);
  }

  /**
   * Get shifts by schedule or assigned user
   */
  async getShifts(filter = {}) {
    return workforceRepository.findShifts(filter);
  }

  /**
   * Update shift status or details
   */
  async updateShift(id, data) {
    return workforceRepository.updateShift(id, data);
  }
}

module.exports = new ScheduleService();
