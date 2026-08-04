'use strict';

const express = require('express');
const workforceController = require('./workforce.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createScheduleSchema,
  createShiftSchema,
  updateShiftSchema,
  clockInSchema,
  clockOutSchema,
  pauseResumeSchema,
  submitTimesheetSchema,
  approveTimesheetSchema,
  createCapacityPlanSchema,
  createAllocationSchema,
  recordAttendanceSchema,
  createLeaveRequestSchema,
  updateLeaveStatusSchema,
  createTeamAssignmentSchema,
  updateWorkforcePreferenceSchema,
} = require('../../../../shared/src/validators/workforce.validator');

const router = express.Router();

router.use(authenticate);

// Schedules & Shifts
router.get('/schedules', workforceController.getSchedules.bind(workforceController));
router.post('/schedules', validate({ body: createScheduleSchema }), workforceController.createSchedule.bind(workforceController));
router.get('/shifts', workforceController.getShifts.bind(workforceController));
router.post('/shifts', validate({ body: createShiftSchema }), workforceController.createShift.bind(workforceController));
router.patch('/shifts/:id', validate({ body: updateShiftSchema }), workforceController.updateShift.bind(workforceController));

// Time Tracking & Clock
router.post('/clock-in', validate({ body: clockInSchema }), workforceController.clockIn.bind(workforceController));
router.post('/clock-out', validate({ body: clockOutSchema }), workforceController.clockOut.bind(workforceController));
router.post('/clock-pause-resume', validate({ body: pauseResumeSchema }), workforceController.pauseResume.bind(workforceController));
router.get('/clock-active', workforceController.getActiveClock.bind(workforceController));
router.get('/time-entries', workforceController.getTimeEntries.bind(workforceController));

// Timesheets
router.get('/timesheets', workforceController.getTimesheets.bind(workforceController));
router.post('/timesheets', validate({ body: submitTimesheetSchema }), workforceController.submitTimesheet.bind(workforceController));
router.post('/timesheets/:id/review', validate({ body: approveTimesheetSchema }), workforceController.reviewTimesheet.bind(workforceController));

// Capacity Planning & Allocations
router.get('/capacity', workforceController.getCapacityPlans.bind(workforceController));
router.post('/capacity', validate({ body: createCapacityPlanSchema }), workforceController.createCapacityPlan.bind(workforceController));
router.get('/allocations', workforceController.getWorkAllocations.bind(workforceController));
router.post('/allocations', validate({ body: createAllocationSchema }), workforceController.allocateResource.bind(workforceController));

// Productivity
router.get('/productivity', workforceController.getProductivity.bind(workforceController));
router.post('/productivity/calculate', workforceController.calculateProductivity.bind(workforceController));
router.get('/productivity/snapshots', workforceController.getProductivitySnapshots.bind(workforceController));

// Attendance
router.get('/attendance', workforceController.getAttendanceRecords.bind(workforceController));
router.post('/attendance', validate({ body: recordAttendanceSchema }), workforceController.recordAttendance.bind(workforceController));

// Leave Management
router.get('/leave', workforceController.getLeaveRequests.bind(workforceController));
router.post('/leave', validate({ body: createLeaveRequestSchema }), workforceController.requestLeave.bind(workforceController));
router.post('/leave/:id/review', validate({ body: updateLeaveStatusSchema }), workforceController.reviewLeaveRequest.bind(workforceController));
router.get('/leave/balance', workforceController.getLeaveBalance.bind(workforceController));

// Teams & Preferences
router.get('/teams', workforceController.getTeamAssignments.bind(workforceController));
router.post('/teams', validate({ body: createTeamAssignmentSchema }), workforceController.createTeamAssignment.bind(workforceController));
router.get('/preferences', workforceController.getPreference.bind(workforceController));
router.put('/preferences', validate({ body: updateWorkforcePreferenceSchema }), workforceController.updatePreference.bind(workforceController));

// AI Insights
router.get('/ai-insights', workforceController.getAIInsights.bind(workforceController));

module.exports = router;
