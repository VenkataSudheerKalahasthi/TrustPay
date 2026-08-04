'use strict';

const { z } = require('zod');

const createScheduleSchema = z.object({
  organizationId: z.string().optional(),
  name: z.string().min(2, 'Schedule name is required').max(100),
  description: z.string().optional(),
  timezone: z.string().default('UTC'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const updateScheduleSchema = createScheduleSchema.partial();

const createShiftSchema = z.object({
  scheduleId: z.string().min(1, 'Schedule ID is required'),
  name: z.string().min(2, 'Shift name is required').max(100),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time format (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time format (HH:mm)'),
  daysOfWeek: z.string().default('[1,2,3,4,5]'),
  breakDurationMins: z.number().int().nonnegative().default(60),
  status: z.enum(['SCHEDULED', 'ACTIVE', 'COMPLETED', 'MISSED', 'CANCELLED']).default('SCHEDULED'),
  assignedUserId: z.string().optional(),
});

const updateShiftSchema = createShiftSchema.partial();

const clockInSchema = z.object({
  projectId: z.string().optional(),
  contractId: z.string().optional(),
  workShiftId: z.string().optional(),
  isBillable: z.boolean().default(true),
  notes: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
});

const clockOutSchema = z.object({
  timeEntryId: z.string().min(1, 'Time entry ID is required'),
  notes: z.string().optional(),
  breakMinutes: z.number().int().nonnegative().default(0),
});

const pauseResumeSchema = z.object({
  timeEntryId: z.string().min(1, 'Time entry ID is required'),
  breakMinutes: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

const submitTimesheetSchema = z.object({
  organizationId: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().optional(),
});

const approveTimesheetSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().optional(),
});

const createCapacityPlanSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  name: z.string().min(2).max(100),
  startDate: z.string(),
  endDate: z.string(),
  targetCapacityHours: z.number().positive(),
  notes: z.string().optional(),
});

const updateCapacityPlanSchema = createCapacityPlanSchema.partial();

const createAllocationSchema = z.object({
  capacityPlanId: z.string().min(1, 'Capacity Plan ID is required'),
  workerUserId: z.string().min(1, 'Worker User ID is required'),
  projectId: z.string().optional(),
  role: z.string().optional(),
  allocatedHours: z.number().positive(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['PLANNED', 'ALLOCATED', 'IN_PROGRESS', 'COMPLETED']).default('PLANNED'),
});

const updateAllocationSchema = createAllocationSchema.partial();

const recordAttendanceSchema = z.object({
  workerUserId: z.string().min(1, 'Worker User ID is required'),
  workShiftId: z.string().optional(),
  date: z.string(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'REMOTE', 'HALF_DAY']).default('PRESENT'),
  remarks: z.string().optional(),
});

const createLeaveRequestSchema = z.object({
  organizationId: z.string().optional(),
  leaveType: z.string().default('VACATION'),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional(),
});

const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'CANCELLED']),
  rejectedReason: z.string().optional(),
});

const createTeamAssignmentSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  workerUserId: z.string().min(1, 'Worker User ID is required'),
  teamName: z.string().min(1, 'Team name is required'),
  role: z.string().optional(),
  isLead: z.boolean().default(false),
});

const updateWorkforcePreferenceSchema = z.object({
  preferredShiftStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  maxHoursPerWeek: z.number().int().positive().max(168).optional(),
  autoClockOut: z.boolean().optional(),
  timezone: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
});

module.exports = {
  createScheduleSchema,
  updateScheduleSchema,
  createShiftSchema,
  updateShiftSchema,
  clockInSchema,
  clockOutSchema,
  pauseResumeSchema,
  submitTimesheetSchema,
  approveTimesheetSchema,
  createCapacityPlanSchema,
  updateCapacityPlanSchema,
  createAllocationSchema,
  updateAllocationSchema,
  recordAttendanceSchema,
  createLeaveRequestSchema,
  updateLeaveStatusSchema,
  createTeamAssignmentSchema,
  updateWorkforcePreferenceSchema,
};
