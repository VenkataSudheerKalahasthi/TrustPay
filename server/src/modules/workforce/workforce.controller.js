'use strict';

const workforceService = require('./workforce.service');

class WorkforceController {
  // Schedules & Shifts
  async createSchedule(req, res) {
    const schedule = await workforceService.createSchedule(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Work schedule created successfully', data: schedule });
  }

  async getSchedules(req, res) {
    const schedules = await workforceService.getSchedules(req.query);
    res.status(200).json({ success: true, data: schedules });
  }

  async createShift(req, res) {
    const shift = await workforceService.createShift(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Work shift created successfully', data: shift });
  }

  async getShifts(req, res) {
    const shifts = await workforceService.getShifts(req.query);
    res.status(200).json({ success: true, data: shifts });
  }

  async updateShift(req, res) {
    const shift = await workforceService.updateShift(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, message: 'Shift updated successfully', data: shift });
  }

  // Time Tracking & Timesheets
  async clockIn(req, res) {
    const entry = await workforceService.clockIn(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Clock-in recorded successfully', data: entry });
  }

  async clockOut(req, res) {
    const entry = await workforceService.clockOut(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Clock-out recorded successfully', data: entry });
  }

  async pauseResume(req, res) {
    const entry = await workforceService.pauseOrResume(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Time entry updated successfully', data: entry });
  }

  async getActiveClock(req, res) {
    const entry = await workforceService.getActiveClockState(req.user.id);
    res.status(200).json({ success: true, data: entry });
  }

  async getTimeEntries(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'WORKER') {
      filter.workerUserId = req.user.id;
    }
    const entries = await workforceService.getTimeEntries(filter);
    res.status(200).json({ success: true, data: entries });
  }

  async submitTimesheet(req, res) {
    const timesheet = await workforceService.submitTimesheet(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Timesheet submitted for approval', data: timesheet });
  }

  async getTimesheets(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'WORKER') {
      filter.workerUserId = req.user.id;
    }
    const timesheets = await workforceService.getTimesheets(filter);
    res.status(200).json({ success: true, data: timesheets });
  }

  async reviewTimesheet(req, res) {
    const timesheet = await workforceService.reviewTimesheet(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, message: `Timesheet ${req.body.status.toLowerCase()} successfully`, data: timesheet });
  }

  // Capacity & Allocations
  async createCapacityPlan(req, res) {
    const plan = await workforceService.createCapacityPlan(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Capacity plan created successfully', data: plan });
  }

  async getCapacityPlans(req, res) {
    const plans = await workforceService.getCapacityPlans(req.query.organizationId);
    res.status(200).json({ success: true, data: plans });
  }

  async allocateResource(req, res) {
    const allocation = await workforceService.allocateResource(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Resource allocated successfully', data: allocation });
  }

  async getWorkAllocations(req, res) {
    const allocations = await workforceService.getWorkAllocations(req.query);
    res.status(200).json({ success: true, data: allocations });
  }

  // Productivity
  async getProductivity(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'WORKER') {
      filter.workerUserId = req.user.id;
    }
    const metrics = await workforceService.getProductivityMetrics(filter);
    res.status(200).json({ success: true, data: metrics });
  }

  async calculateProductivity(req, res) {
    const metric = await workforceService.calculateProductivity(req.body.workerUserId || req.user.id, req.body.period || 'CURRENT', req.body.organizationId);
    res.status(200).json({ success: true, message: 'Productivity calculated successfully', data: metric });
  }

  async getProductivitySnapshots(req, res) {
    const snapshots = await workforceService.getProductivitySnapshots(req.query.organizationId);
    res.status(200).json({ success: true, data: snapshots });
  }

  // Attendance Records
  async recordAttendance(req, res) {
    const record = await workforceService.recordAttendance(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Attendance recorded successfully', data: record });
  }

  async getAttendanceRecords(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'WORKER') {
      filter.workerUserId = req.user.id;
    }
    const records = await workforceService.getAttendanceRecords(filter);
    res.status(200).json({ success: true, data: records });
  }

  // Leave Requests & Balances
  async requestLeave(req, res) {
    const leave = await workforceService.requestLeave(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Leave request submitted successfully', data: leave });
  }

  async getLeaveRequests(req, res) {
    const filter = { ...req.query };
    if (req.user.role === 'WORKER') {
      filter.workerUserId = req.user.id;
    }
    const requests = await workforceService.getLeaveRequests(filter);
    res.status(200).json({ success: true, data: requests });
  }

  async reviewLeaveRequest(req, res) {
    const leave = await workforceService.reviewLeaveRequest(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, message: `Leave request ${req.body.status.toLowerCase()} successfully`, data: leave });
  }

  async getLeaveBalance(req, res) {
    const balance = await workforceService.getLeaveBalance(req.user.id, req.query.year ? parseInt(req.query.year, 10) : null);
    res.status(200).json({ success: true, data: balance });
  }

  // Teams & Preferences
  async createTeamAssignment(req, res) {
    const team = await workforceService.createTeamAssignment(req.body);
    res.status(201).json({ success: true, message: 'Team assignment created', data: team });
  }

  async getTeamAssignments(req, res) {
    const teams = await workforceService.getTeamAssignments(req.query.organizationId);
    res.status(200).json({ success: true, data: teams });
  }

  async updatePreference(req, res) {
    const pref = await workforceService.updatePreference(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Workforce preferences updated', data: pref });
  }

  async getPreference(req, res) {
    const pref = await workforceService.getPreference(req.user.id);
    res.status(200).json({ success: true, data: pref });
  }

  // AI Advisory Insights
  async getAIInsights(req, res) {
    const insights = await workforceService.getAIWorkforceInsights(req.query.organizationId);
    res.status(200).json({ success: true, data: insights });
  }
}

module.exports = new WorkforceController();
