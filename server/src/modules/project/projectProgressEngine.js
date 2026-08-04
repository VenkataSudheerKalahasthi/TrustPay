'use strict';

/**
 * Project Progress Engine
 * Dynamically computes project completion percentage based on milestone statuses
 * and approved deliverables. Never stores arbitrary unvalidated progress overrides.
 */

/**
 * Calculates dynamic completion metrics for a project based on its milestones and deliverables.
 * @param {Array} milestones 
 * @param {Array} deliverables 
 * @returns {object} { progressPercentage, completedMilestonesCount, totalMilestonesCount, approvedDeliverablesCount, totalDeliverablesCount }
 */
function calculateProjectProgress(milestones = [], deliverables = []) {
  const totalMilestones = milestones.length;
  const totalDeliverables = deliverables.length;

  if (totalMilestones === 0 && totalDeliverables === 0) {
    return {
      progressPercentage: 0,
      completedMilestonesCount: 0,
      totalMilestonesCount: 0,
      approvedDeliverablesCount: 0,
      totalDeliverablesCount: 0,
    };
  }

  // Count completed milestones
  const completedMilestones = milestones.filter((m) => m.status === 'COMPLETED').length;

  // Count approved deliverables
  const approvedDeliverables = deliverables.filter((d) => d.status === 'APPROVED').length;

  let progress = 0;

  if (totalMilestones > 0 && totalDeliverables > 0) {
    // 60% weight on milestone completion, 40% weight on deliverable approval
    const milestoneProgress = (completedMilestones / totalMilestones) * 60;
    const deliverableProgress = (approvedDeliverables / totalDeliverables) * 40;
    progress = Math.round(milestoneProgress + deliverableProgress);
  } else if (totalMilestones > 0) {
    progress = Math.round((completedMilestones / totalMilestones) * 100);
  } else if (totalDeliverables > 0) {
    progress = Math.round((approvedDeliverables / totalDeliverables) * 100);
  }

  return {
    progressPercentage: Math.min(100, Math.max(0, progress)),
    completedMilestonesCount: completedMilestones,
    totalMilestonesCount: totalMilestones,
    approvedDeliverablesCount: approvedDeliverables,
    totalDeliverablesCount: totalDeliverables,
  };
}

module.exports = {
  calculateProjectProgress,
};
