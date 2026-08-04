'use strict';

/**
 * Centralized Message Delivery State Machine
 * Enforces valid delivery status transitions:
 * SENDING -> SENT / FAILED
 * SENT -> DELIVERED / READ / FAILED
 * DELIVERED -> READ
 * FAILED -> SENDING / SENT (retry logic)
 */
const ALLOWED_DELIVERY_TRANSITIONS = Object.freeze({
  SENDING: ['SENT', 'FAILED'],
  SENT: ['DELIVERED', 'READ', 'FAILED'],
  DELIVERED: ['READ'],
  READ: [],
  FAILED: ['SENDING', 'SENT'],
});

/**
 * Validates whether a delivery status transition from currentStatus to targetStatus is permitted.
 * @param {string} currentStatus 
 * @param {string} targetStatus 
 * @returns {boolean}
 */
function isValidDeliveryTransition(currentStatus, targetStatus) {
  if (currentStatus === targetStatus) {
    return true;
  }
  const allowed = ALLOWED_DELIVERY_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

module.exports = {
  ALLOWED_DELIVERY_TRANSITIONS,
  isValidDeliveryTransition,
};
