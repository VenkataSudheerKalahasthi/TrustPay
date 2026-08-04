'use strict';

/**
 * Escrow Readiness Calculator
 * Evaluates milestones to calculate escrow release readiness metadata.
 * Does NOT release escrow automatically — only prepares readiness metadata for client action.
 */

/**
 * Computes escrow readiness for a given milestone.
 * @param {object} milestone - Milestone with linked deliverables
 * @returns {object} { isReleaseEligible, amountReady, approvedAmount, reason }
 */
function calculateMilestoneEscrowReadiness(milestone) {
  if (!milestone) {
    return {
      isReleaseEligible: false,
      amountReady: 0,
      approvedAmount: 0,
      reason: 'Milestone data unavailable',
    };
  }

  const estimatedAmount = milestone.estimatedAmount || 0;
  const deliverables = milestone.deliverables || [];

  if (milestone.status !== 'COMPLETED') {
    return {
      isReleaseEligible: false,
      amountReady: 0,
      approvedAmount: 0,
      reason: 'Milestone status is not COMPLETED',
    };
  }

  if (deliverables.length > 0) {
    const unapproved = deliverables.filter((d) => d.status !== 'APPROVED');
    if (unapproved.length > 0) {
      return {
        isReleaseEligible: false,
        amountReady: 0,
        approvedAmount: 0,
        reason: `${unapproved.length} linked deliverable(s) are not APPROVED`,
      };
    }
  }

  return {
    isReleaseEligible: true,
    amountReady: estimatedAmount,
    approvedAmount: estimatedAmount,
    reason: 'Milestone is COMPLETED and all linked deliverables are APPROVED',
  };
}

module.exports = {
  calculateMilestoneEscrowReadiness,
};
