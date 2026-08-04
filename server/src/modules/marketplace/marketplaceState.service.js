'use strict';

class MarketplaceStateService {
  /**
   * Deterministic Job Lifecycle Transitions
   * DRAFT -> OPEN -> PAUSED -> FILLED / EXPIRED / CANCELLED / ARCHIVED
   */
  validateJobTransition(currentStatus, nextStatus) {
    const allowed = {
      DRAFT: ['OPEN', 'CANCELLED'],
      OPEN: ['PAUSED', 'FILLED', 'EXPIRED', 'CANCELLED', 'ARCHIVED'],
      PAUSED: ['OPEN', 'CANCELLED', 'ARCHIVED'],
      FILLED: ['ARCHIVED'],
      EXPIRED: ['OPEN', 'ARCHIVED'],
      CANCELLED: ['ARCHIVED'],
      ARCHIVED: [],
    };

    if (!allowed[currentStatus] || !allowed[currentStatus].includes(nextStatus)) {
      throw new Error(`Invalid Job state transition from ${currentStatus} to ${nextStatus}`);
    }
    return true;
  }

  /**
   * Deterministic Proposal Lifecycle Transitions
   * SUBMITTED -> SHORTLISTED -> INTERVIEW -> OFFERED -> ACCEPTED
   */
  validateProposalTransition(currentStatus, nextStatus) {
    const allowed = {
      SUBMITTED: ['SHORTLISTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'],
      SHORTLISTED: ['INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN'],
      INTERVIEW: ['OFFERED', 'REJECTED', 'WITHDRAWN'],
      OFFERED: ['ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'],
      ACCEPTED: ['ARCHIVED'],
      REJECTED: ['ARCHIVED'],
      WITHDRAWN: [],
      EXPIRED: ['ARCHIVED'],
      ARCHIVED: [],
    };

    if (!allowed[currentStatus] || !allowed[currentStatus].includes(nextStatus)) {
      throw new Error(`Invalid Proposal state transition from ${currentStatus} to ${nextStatus}`);
    }

    // Determine freeze status (Bid and Milestones become immutable)
    const isFrozen = ['SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED'].includes(nextStatus);
    return { valid: true, isFrozen };
  }
}

module.exports = new MarketplaceStateService();
