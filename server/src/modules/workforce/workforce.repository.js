'use strict';

const { prisma } = require('../../config/database');

class WorkforceRepository {
  // ─── Work Schedules & Shifts ─────────────────────────────────
  async createSchedule(data) {
    return prisma.workSchedule.create({
      data: {
        organizationId: data.organizationId || null,
        name: data.name,
        description: data.description || null,
        timezone: data.timezone || 'UTC',
        isDefault: data.isDefault || false,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: { shifts: true },
    });
  }

  async findSchedules(filter = {}) {
    const where = {};
    if (filter.organizationId) {
      where.organizationId = filter.organizationId;
    }
    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    return prisma.workSchedule.findMany({
      where,
      include: {
        shifts: {
          include: {
            assignedUser: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findScheduleById(id) {
    return prisma.workSchedule.findUnique({
      where: { id },
      include: {
        shifts: {
          include: {
            assignedUser: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
      },
    });
  }

  async updateSchedule(id, data) {
    return prisma.workSchedule.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      include: { shifts: true },
    });
  }

  async createShift(data) {
    return prisma.workShift.create({
      data: {
        scheduleId: data.scheduleId,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        daysOfWeek: data.daysOfWeek || '[1,2,3,4,5]',
        breakDurationMins: data.breakDurationMins !== undefined ? data.breakDurationMins : 60,
        status: data.status || 'SCHEDULED',
        assignedUserId: data.assignedUserId || null,
      },
      include: {
        assignedUser: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
      },
    });
  }

  async findShifts(filter = {}) {
    const where = {};
    if (filter.scheduleId) {
      where.scheduleId = filter.scheduleId;
    }
    if (filter.assignedUserId) {
      where.assignedUserId = filter.assignedUserId;
    }
    if (filter.status) {
      where.status = filter.status;
    }

    return prisma.workShift.findMany({
      where,
      include: {
        schedule: { select: { id: true, name: true, organizationId: true } },
        assignedUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateShift(id, data) {
    return prisma.workShift.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      include: {
        assignedUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  // ─── Time Entries & Timesheets ──────────────────────────────
  async createTimeEntry(data) {
    return prisma.timeEntry.create({
      data: {
        workerUserId: data.workerUserId,
        projectId: data.projectId || null,
        contractId: data.contractId || null,
        workShiftId: data.workShiftId || null,
        clockIn: data.clockIn ? new Date(data.clockIn) : new Date(),
        status: data.status || 'PRESENT',
        isBillable: data.isBillable !== undefined ? data.isBillable : true,
        breakMinutes: data.breakMinutes || 0,
        notes: data.notes || null,
        hourlyRate: data.hourlyRate || null,
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        workShift: true,
      },
    });
  }

  async findActiveTimeEntry(workerUserId) {
    return prisma.timeEntry.findFirst({
      where: {
        workerUserId,
        clockOut: null,
      },
      orderBy: { clockIn: 'desc' },
    });
  }

  async updateTimeEntry(id, data) {
    return prisma.timeEntry.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  async findTimeEntries(filter = {}) {
    const where = {};
    if (filter.workerUserId) {
      where.workerUserId = filter.workerUserId;
    }
    if (filter.projectId) {
      where.projectId = filter.projectId;
    }
    if (filter.startDate || filter.endDate) {
      where.clockIn = {};
      if (filter.startDate) {
        where.clockIn.gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        where.clockIn.lte = new Date(filter.endDate);
      }
    }

    return prisma.timeEntry.findMany({
      where,
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        workShift: true,
        approvals: { include: { approvedBy: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { clockIn: 'desc' },
    });
  }

  async createTimesheet(data) {
    return prisma.timesheet.create({
      data: {
        workerUserId: data.workerUserId,
        organizationId: data.organizationId || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status || 'DRAFT',
        totalHours: data.totalHours || 0,
        billableHours: data.billableHours || 0,
        overtimeHours: data.overtimeHours || 0,
        notes: data.notes || null,
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  async findTimesheets(filter = {}) {
    const where = {};
    if (filter.workerUserId) {
      where.workerUserId = filter.workerUserId;
    }
    if (filter.organizationId) {
      where.organizationId = filter.organizationId;
    }
    if (filter.status) {
      where.status = filter.status;
    }

    return prisma.timesheet.findMany({
      where,
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        organization: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTimesheet(id, data) {
    return prisma.timesheet.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  // ─── Capacity Plans & Work Allocations ───────────────────────
  async createCapacityPlan(data) {
    return prisma.capacityPlan.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        targetCapacityHours: data.targetCapacityHours,
        totalAllocatedHours: data.totalAllocatedHours || 0,
        status: data.status || 'AVAILABLE',
        notes: data.notes || null,
      },
      include: { allocations: true },
    });
  }

  async findCapacityPlans(organizationId) {
    return prisma.capacityPlan.findMany({
      where: { organizationId },
      include: {
        allocations: {
          include: {
            workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createWorkAllocation(data) {
    return prisma.workAllocation.create({
      data: {
        capacityPlanId: data.capacityPlanId,
        workerUserId: data.workerUserId,
        projectId: data.projectId || null,
        role: data.role || null,
        allocatedHours: data.allocatedHours,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status || 'PLANNED',
        utilizationPct: data.utilizationPct || 0,
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        capacityPlan: true,
      },
    });
  }

  async findWorkAllocations(filter = {}) {
    const where = {};
    if (filter.capacityPlanId) {
      where.capacityPlanId = filter.capacityPlanId;
    }
    if (filter.workerUserId) {
      where.workerUserId = filter.workerUserId;
    }
    if (filter.projectId) {
      where.projectId = filter.projectId;
    }

    return prisma.workAllocation.findMany({
      where,
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        capacityPlan: { select: { id: true, name: true, targetCapacityHours: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Productivity Metrics & Snapshots ───────────────────────
  async upsertProductivityMetric(workerUserId, period, data) {
    return prisma.productivityMetric.upsert({
      where: { id: data.id || 'new-metric-id-placeholder' },
      create: {
        workerUserId,
        organizationId: data.organizationId || null,
        period,
        billableHours: data.billableHours || 0,
        idleHours: data.idleHours || 0,
        overtimeHours: data.overtimeHours || 0,
        attendancePct: data.attendancePct || 100,
        utilizationPct: data.utilizationPct || 100,
        efficiencyScore: data.efficiencyScore || 100,
        productivityScore: data.productivityScore || 100,
      },
      update: {
        billableHours: data.billableHours,
        idleHours: data.idleHours,
        overtimeHours: data.overtimeHours,
        attendancePct: data.attendancePct,
        utilizationPct: data.utilizationPct,
        efficiencyScore: data.efficiencyScore,
        productivityScore: data.productivityScore,
      },
    });
  }

  async findProductivityMetrics(filter = {}) {
    const where = {};
    if (filter.workerUserId) {
      where.workerUserId = filter.workerUserId;
    }
    if (filter.organizationId) {
      where.organizationId = filter.organizationId;
    }
    if (filter.period) {
      where.period = filter.period;
    }

    return prisma.productivityMetric.findMany({
      where,
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProductivitySnapshot(data) {
    return prisma.productivitySnapshot.create({
      data: {
        organizationId: data.organizationId,
        snapshotDate: data.snapshotDate ? new Date(data.snapshotDate) : new Date(),
        avgProductivityScore: data.avgProductivityScore,
        avgUtilizationPct: data.avgUtilizationPct,
        totalBillableHours: data.totalBillableHours,
        totalIdleHours: data.totalIdleHours,
        activeWorkersCount: data.activeWorkersCount,
      },
    });
  }

  async findProductivitySnapshots(organizationId) {
    return prisma.productivitySnapshot.findMany({
      where: { organizationId },
      orderBy: { snapshotDate: 'desc' },
    });
  }

  // ─── Attendance Records ─────────────────────────────────────
  async createAttendanceRecord(data) {
    return prisma.attendanceRecord.create({
      data: {
        workerUserId: data.workerUserId,
        workShiftId: data.workShiftId || null,
        date: new Date(data.date),
        status: data.status || 'PRESENT',
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        remarks: data.remarks || null,
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        workShift: true,
      },
    });
  }

  async findAttendanceRecords(filter = {}) {
    const where = {};
    if (filter.workerUserId) {
      where.workerUserId = filter.workerUserId;
    }
    if (filter.workShiftId) {
      where.workShiftId = filter.workShiftId;
    }
    if (filter.status) {
      where.status = filter.status;
    }

    return prisma.attendanceRecord.findMany({
      where,
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        workShift: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // ─── Leave Requests & Balances ──────────────────────────────
  async createLeaveRequest(data) {
    return prisma.leaveRequest.create({
      data: {
        workerUserId: data.workerUserId,
        organizationId: data.organizationId || null,
        leaveType: data.leaveType || 'VACATION',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalDays: data.totalDays,
        reason: data.reason || null,
        status: data.status || 'PENDING',
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  async findLeaveRequests(filter = {}) {
    const where = {};
    if (filter.workerUserId) {
      where.workerUserId = filter.workerUserId;
    }
    if (filter.organizationId) {
      where.organizationId = filter.organizationId;
    }
    if (filter.status) {
      where.status = filter.status;
    }

    return prisma.leaveRequest.findMany({
      where,
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLeaveRequest(id, data) {
    return prisma.leaveRequest.update({
      where: { id },
      data,
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  async findOrCreateLeaveBalance(workerUserId, year, organizationId = null) {
    let balance = await prisma.leaveBalance.findUnique({
      where: { workerUserId_year: { workerUserId, year } },
    });

    if (!balance) {
      balance = await prisma.leaveBalance.create({
        data: {
          workerUserId,
          organizationId,
          year,
          totalAllowance: 20.0,
          usedDays: 0.0,
          pendingDays: 0.0,
          remainingDays: 20.0,
        },
      });
    }
    return balance;
  }

  async updateLeaveBalance(id, data) {
    return prisma.leaveBalance.update({
      where: { id },
      data,
    });
  }

  // ─── Team Assignments & Preferences ────────────────────────
  async createTeamAssignment(data) {
    return prisma.teamAssignment.create({
      data: {
        organizationId: data.organizationId,
        workerUserId: data.workerUserId,
        teamName: data.teamName,
        role: data.role || null,
        isLead: data.isLead || false,
      },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    });
  }

  async findTeamAssignments(organizationId) {
    return prisma.teamAssignment.findMany({
      where: { organizationId },
      include: {
        workerUser: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async upsertWorkforcePreference(userId, data) {
    return prisma.workforcePreference.upsert({
      where: { userId },
      create: {
        userId,
        preferredShiftStart: data.preferredShiftStart || null,
        maxHoursPerWeek: data.maxHoursPerWeek || 40,
        autoClockOut: data.autoClockOut !== undefined ? data.autoClockOut : false,
        timezone: data.timezone || 'UTC',
        notificationsEnabled: data.notificationsEnabled !== undefined ? data.notificationsEnabled : true,
      },
      update: {
        preferredShiftStart: data.preferredShiftStart,
        maxHoursPerWeek: data.maxHoursPerWeek,
        autoClockOut: data.autoClockOut,
        timezone: data.timezone,
        notificationsEnabled: data.notificationsEnabled,
      },
    });
  }

  async findWorkforcePreference(userId) {
    return prisma.workforcePreference.findUnique({
      where: { userId },
    });
  }
}

module.exports = new WorkforceRepository();
