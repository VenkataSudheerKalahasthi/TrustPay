'use strict';

/**
 * Centralized Deliverable Approval Workflow
 * Enforces valid state transitions for Deliverable submissions and client reviews.
 */
const ALLOWED_DELIVERABLE_TRANSITIONS = Object.freeze({
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW', 'APPROVED', 'REVISION_REQUESTED', 'REJECTED'],
  UNDER_REVIEW: ['APPROVED', 'REVISION_REQUESTED', 'REJECTED'],
  REVISION_REQUESTED: ['SUBMITTED'],
  REJECTED: ['SUBMITTED'],
  APPROVED: [],
});

/**
 * Validates if a transition from currentStatus to targetStatus is allowed for a Deliverable.
 * @param {string} currentStatus 
 * @param {string} targetStatus 
 * @returns {boolean}
 */
function isValidDeliverableTransition(currentStatus, targetStatus) {
  if (currentStatus === targetStatus) {
    return true;
  }
  const allowed = ALLOWED_DELIVERABLE_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

module.exports = {
  ALLOWED_DELIVERABLE_TRANSITIONS,
  isValidDeliverableTransition,
};
