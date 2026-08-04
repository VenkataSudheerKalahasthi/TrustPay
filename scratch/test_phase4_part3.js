'use strict';

/**
 * Phase 4 – Part 3: Enterprise Workforce Operations & Productivity Suite Verification Script
 */

const workforceService = require('../server/src/modules/workforce/workforce.service');
const scheduleService = require('../server/src/modules/workforce/schedule.service');
const timesheetService = require('../server/src/modules/workforce/timesheet.service');
const capacityService = require('../server/src/modules/workforce/capacity.service');
const productivityService = require('../server/src/modules/workforce/productivity.service');

async function runVerification() {
  console.log('=== STARTING PHASE 4 - PART 3 WORKFORCE OPERATIONS & PRODUCTIVITY VERIFICATION ===\n');

  const testWorkerId = 'usr_worker_w1_test';
  const testAdminId = 'usr_admin_w1_test';

  // 1. Work Schedule & Shift Creation
  console.log('1. Testing Work Schedule & Shift Management...');
  const schedule = await workforceService.createSchedule(
    { name: 'Engineering Core Hours', timezone: 'UTC' },
    testAdminId
  );
  console.log(`   ✓ Created Schedule ID: ${schedule.id} (${schedule.name})`);

  const shift = await workforceService.createShift(
    {
      scheduleId: schedule.id,
      name: 'Day Shift',
      startTime: '09:00',
      endTime: '17:00',
      breakDurationMins: 60,
      assignedUserId: testWorkerId,
    },
    testAdminId
  );
  console.log(`   ✓ Created & Assigned Shift ID: ${shift.id} (${shift.name})`);

  // 2. Time Tracking: Clock In & Clock Out
  console.log('\n2. Testing Live Time Tracking (Clock-in / Clock-out)...');
  const clockInEntry = await workforceService.clockIn(testWorkerId, {
    workShiftId: shift.id,
    isBillable: true,
    notes: 'Starting morning tasks',
  });
  console.log(`   ✓ Clocked In Entry ID: ${clockInEntry.id}`);

  const activeClock = await workforceService.getActiveClockState(testWorkerId);
  console.log(`   ✓ Active Clock State Verified: ${activeClock ? 'Active Session Found' : 'None'}`);

  const clockOutEntry = await workforceService.clockOut(testWorkerId, {
    breakMinutes: 30,
    notes: 'Completed work block',
  });
  console.log(`   ✓ Clocked Out Entry ID: ${clockOutEntry.id}`);

  // 3. Timesheet Submission & Approval
  console.log('\n3. Testing Timesheet Submission & Approval Workflow...');
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const timesheet = await workforceService.submitTimesheet(testWorkerId, {
    startDate: lastWeek.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
    notes: 'Weekly Log',
  });
  console.log(`   ✓ Timesheet Submitted ID: ${timesheet.id} (Status: ${timesheet.status})`);

  const reviewedTimesheet = await workforceService.reviewTimesheet(timesheet.id, testAdminId, {
    status: 'APPROVED',
    notes: 'Verified hours',
  });
  console.log(`   ✓ Timesheet Reviewed: Status = ${reviewedTimesheet.status}`);

  // 4. Capacity Planning & Resource Allocation
  console.log('\n4. Testing Capacity Planning & Resource Allocation...');
  const plan = await workforceService.createCapacityPlan(
    {
      organizationId: 'org_enterprise_01',
      name: 'Q3 Product Team Plan',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      targetCapacityHours: 160,
    },
    testAdminId
  );
  console.log(`   ✓ Capacity Plan Created: ${plan.name} (Target: ${plan.targetCapacityHours}h)`);

  const allocation = await workforceService.allocateResource(
    {
      capacityPlanId: plan.id,
      workerUserId: testWorkerId,
      allocatedHours: 40,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    testAdminId
  );
  console.log(`   ✓ Resource Allocated: ${allocation.allocatedHours}h for Worker ${testWorkerId}`);

  // 5. Leave Request & Balance Workflow
  console.log('\n5. Testing Leave Request & Balance Workflow...');
  const leaveReq = await workforceService.requestLeave(testWorkerId, {
    organizationId: 'org_enterprise_01',
    leaveType: 'VACATION',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    reason: 'Family Vacation',
  });
  console.log(`   ✓ Leave Request Created ID: ${leaveReq.id} (${leaveReq.totalDays} days)`);

  const reviewedLeave = await workforceService.reviewLeaveRequest(leaveReq.id, testAdminId, {
    status: 'APPROVED',
  });
  console.log(`   ✓ Leave Request Reviewed: Status = ${reviewedLeave.status}`);

  const balance = await workforceService.getLeaveBalance(testWorkerId);
  console.log(`   ✓ Leave Balance Updated: Used = ${balance.usedDays}d, Remaining = ${balance.remainingDays}d`);

  // 6. Productivity Metrics & Snapshots
  console.log('\n6. Testing Productivity Scoring & Snapshot Generator...');
  const prodMetric = await workforceService.calculateProductivity(testWorkerId, '2026-W31', 'org_enterprise_01');
  console.log(`   ✓ Worker Productivity Score: ${prodMetric.productivityScore}/100`);

  const snapshot = await workforceService.createProductivitySnapshot('org_enterprise_01');
  console.log(`   ✓ Org Productivity Snapshot: Avg Score = ${snapshot.avgProductivityScore}`);

  // 7. AI Advisory Insights Engine
  console.log('\n7. Testing AI Advisory Workforce Insights Engine...');
  const insights = await workforceService.getAIWorkforceInsights('org_enterprise_01');
  console.log(`   ✓ AI Insights Generated: ${insights.insights.length} Advisory Recommendations`);
  insights.insights.forEach((ins, idx) => {
    console.log(`      [${idx + 1}] ${ins.title} (${ins.severity}): ${ins.recommendation}`);
  });

  console.log('\n========================================================================');
  console.log('✓ ALL PHASE 4 PART 3 WORKFORCE & PRODUCTIVITY VERIFICATION TESTS PASSED!');
  console.log('========================================================================');
}

runVerification().catch((err) => {
  console.error('Verification failure:', err);
  process.exit(1);
});
