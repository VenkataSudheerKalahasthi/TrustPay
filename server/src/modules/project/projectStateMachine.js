'use strict';

/**
 * Centralized Project State Machine
 * Enforces valid lifecycle state transitions for Projects.
 */
const ALLOWED_PROJECT_TRANSITIONS = Object.freeze({
  DRAFT: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['ON_HOLD', 'IN_REVIEW', 'CANCELLED'],
  ON_HOLD: ['ACTIVE', 'CANCELLED'],
  IN_REVIEW: ['COMPLETED', 'ACTIVE', 'CANCELLED'],
  COMPLETED: ['ARCHIVED'],
  CANCELLED: ['ARCHIVED'],
  ARCHIVED: [],
});

/**
 * Validates whether a state transition from currentStatus to targetStatus is permitted.
 * @param {string} currentStatus 
 * @param {string} targetStatus 
 * @returns {boolean}
 */
function isValidProjectTransition(currentStatus, targetStatus) {
  if (currentStatus === targetStatus) {
    return true; // No state change
  }
  const allowed = ALLOWED_PROJECT_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

/**
 * Returns field update object containing status and appropriate timestamp field update.
 * @param {string} targetStatus 
 * @returns {object}
 */
function getStatusTimestampUpdates(targetStatus) {
  const now = new Date();
  const updates = { status: targetStatus };

  switch (targetStatus) {
    case 'ACTIVE':
      updates.startedAt = now;
      break;
    case 'ON_HOLD':
      updates.onHoldAt = now;
      break;
    case 'IN_REVIEW':
      updates.inReviewAt = now;
      break;
    case 'COMPLETED':
      updates.completedAt = now;
      updates.actualEndDate = now;
      break;
    case 'CANCELLED':
      updates.cancelledAt = now;
      break;
    case 'ARCHIVED':
      updates.archivedAt = now;
      break;
    default:
      break;
  }
  return updates;
}

module.exports = {
  ALLOWED_PROJECT_TRANSITIONS,
  isValidProjectTransition,
  getStatusTimestampUpdates,
};
