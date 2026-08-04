import api from './api';

export const workforceService = {
  // Schedules & Shifts
  getSchedules: async (params = {}) => {
    const res = await api.get('/workforce/schedules', { params });
    return res.data.data;
  },

  createSchedule: async (data) => {
    const res = await api.post('/workforce/schedules', data);
    return res.data.data;
  },

  getShifts: async (params = {}) => {
    const res = await api.get('/workforce/shifts', { params });
    return res.data.data;
  },

  createShift: async (data) => {
    const res = await api.post('/workforce/shifts', data);
    return res.data.data;
  },

  updateShift: async (id, data) => {
    const res = await api.patch(`/workforce/shifts/${id}`, data);
    return res.data.data;
  },

  // Time Tracking & Clock
  clockIn: async (data = {}) => {
    const res = await api.post('/workforce/clock-in', data);
    return res.data.data;
  },

  clockOut: async (data = {}) => {
    const res = await api.post('/workforce/clock-out', data);
    return res.data.data;
  },

  pauseResume: async (data = {}) => {
    const res = await api.post('/workforce/clock-pause-resume', data);
    return res.data.data;
  },

  getActiveClock: async () => {
    const res = await api.get('/workforce/clock-active');
    return res.data.data;
  },

  getTimeEntries: async (params = {}) => {
    const res = await api.get('/workforce/time-entries', { params });
    return res.data.data;
  },

  // Timesheets
  getTimesheets: async (params = {}) => {
    const res = await api.get('/workforce/timesheets', { params });
    return res.data.data;
  },

  submitTimesheet: async (data) => {
    const res = await api.post('/workforce/timesheets', data);
    return res.data.data;
  },

  reviewTimesheet: async (id, data) => {
    const res = await api.post(`/workforce/timesheets/${id}/review`, data);
    return res.data.data;
  },

  // Capacity & Allocations
  getCapacityPlans: async (organizationId) => {
    const res = await api.get('/workforce/capacity', { params: { organizationId } });
    return res.data.data;
  },

  createCapacityPlan: async (data) => {
    const res = await api.post('/workforce/capacity', data);
    return res.data.data;
  },

  getWorkAllocations: async (params = {}) => {
    const res = await api.get('/workforce/allocations', { params });
    return res.data.data;
  },

  allocateResource: async (data) => {
    const res = await api.post('/workforce/allocations', data);
    return res.data.data;
  },

  // Productivity
  getProductivity: async (params = {}) => {
    const res = await api.get('/workforce/productivity', { params });
    return res.data.data;
  },

  calculateProductivity: async (data = {}) => {
    const res = await api.post('/workforce/productivity/calculate', data);
    return res.data.data;
  },

  getProductivitySnapshots: async (organizationId) => {
    const res = await api.get('/workforce/productivity/snapshots', { params: { organizationId } });
    return res.data.data;
  },

  // Attendance
  getAttendanceRecords: async (params = {}) => {
    const res = await api.get('/workforce/attendance', { params });
    return res.data.data;
  },

  recordAttendance: async (data) => {
    const res = await api.post('/workforce/attendance', data);
    return res.data.data;
  },

  // Leave Management
  getLeaveRequests: async (params = {}) => {
    const res = await api.get('/workforce/leave', { params });
    return res.data.data;
  },

  requestLeave: async (data) => {
    const res = await api.post('/workforce/leave', data);
    return res.data.data;
  },

  reviewLeaveRequest: async (id, data) => {
    const res = await api.post(`/workforce/leave/${id}/review`, data);
    return res.data.data;
  },

  getLeaveBalance: async (year) => {
    const res = await api.get('/workforce/leave/balance', { params: { year } });
    return res.data.data;
  },

  // Teams & Preferences
  getTeamAssignments: async (organizationId) => {
    const res = await api.get('/workforce/teams', { params: { organizationId } });
    return res.data.data;
  },

  createTeamAssignment: async (data) => {
    const res = await api.post('/workforce/teams', data);
    return res.data.data;
  },

  getPreferences: async () => {
    const res = await api.get('/workforce/preferences');
    return res.data.data;
  },

  updatePreferences: async (data) => {
    const res = await api.put('/workforce/preferences', data);
    return res.data.data;
  },

  // AI Advisory Insights
  getAIInsights: async (organizationId) => {
    const res = await api.get('/workforce/ai-insights', { params: { organizationId } });
    return res.data.data;
  },
};
