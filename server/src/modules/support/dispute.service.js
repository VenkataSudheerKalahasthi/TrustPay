'use strict';

const supportRepository = require('./support.repository');
const notificationService = require('../notification/notification.service');
const activityService = require('../activity/activity.service');

class DisputeService {
  async createDispute(data, raiserUserId) {
    const dispute = await supportRepository.createDisputeCase({
      ...data,
      raiserUserId,
    });

    await activityService.logActivity({
      actorUserId: raiserUserId,
      category: 'SUPPORT',
      action: 'RAISE_DISPUTE',
      title: `Raised Dispute Case #${dispute.disputeNumber}`,
    });

    if (dispute.targetUserId) {
      await notificationService.createNotification({
        userId: dispute.targetUserId,
        category: 'SUPPORT',
        priority: 'HIGH',
        title: `Dispute Case Raised #${dispute.disputeNumber}`,
        message: `A dispute has been submitted regarding contract/project.`,
      });
    }

    return dispute;
  }

  async getDisputes(filter = {}) {
    return supportRepository.findDisputeCases(filter);
  }

  async resolveDispute(disputeCaseId, resolvedById, data) {
    const resolution = await supportRepository.createDisputeResolution({
      disputeCaseId,
      resolvedById,
      notes: data.notes,
      refundAmount: data.refundAmount || 0,
      releaseAmount: data.releaseAmount || 0,
    });

    const cases = await supportRepository.findDisputeCases();
    const disputeCase = cases.find((c) => c.id === disputeCaseId);

    if (disputeCase) {
      await notificationService.createNotification({
        userId: disputeCase.raiserUserId,
        category: 'SUPPORT',
        priority: 'HIGH',
        title: `Dispute Resolved #${disputeCase.disputeNumber}`,
        message: `Dispute case has been officially settled and resolved.`,
      });
    }

    return resolution;
  }
}

module.exports = new DisputeService();
