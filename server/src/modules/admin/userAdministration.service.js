'use strict';

const adminRepository = require('./admin.repository');
const notificationService = require('../notification/notification.service');

class UserAdministrationService {
  async searchUsers(search, role) {
    return adminRepository.findUsers(search, role);
  }

  async toggleUserSuspension(userId, isSuspended, adminId) {
    const user = await adminRepository.setUserSuspension(userId, isSuspended);
    await adminRepository.logAdminAction(adminId, isSuspended ? 'SUSPEND_USER' : 'RESTORE_USER', 'USER', userId, { isSuspended });

    await notificationService.createNotification({
      userId,
      category: 'SECURITY',
      priority: 'HIGH',
      title: isSuspended ? 'Account Suspended' : 'Account Restored',
      message: isSuspended
        ? 'Your TrustPay account access has been suspended by platform administration.'
        : 'Your TrustPay account access has been restored.',
    });

    return user;
  }

  async restrictUser(data, adminId) {
    const restriction = await adminRepository.createUserRestriction({
      ...data,
      imposedById: adminId,
    });

    await adminRepository.logAdminAction(adminId, 'RESTRICT_USER', 'USER', data.targetUserId, data);
    return restriction;
  }

  async addUserNote(data, adminId) {
    const note = await adminRepository.addUserAdministrativeNote({
      ...data,
      authorId: adminId,
    });
    return note;
  }

  async getVerificationReviews() {
    return adminRepository.findVerificationReviews();
  }

  async reviewVerification(id, reviewerId, status, notes) {
    const review = await adminRepository.reviewVerification(id, reviewerId, status, notes);
    await adminRepository.logAdminAction(reviewerId, 'VERIFICATION_REVIEW', 'USER', review.targetUserId, { status, notes });

    await notificationService.createNotification({
      userId: review.targetUserId,
      category: 'SYSTEM',
      priority: 'HIGH',
      title: status === 'VERIFIED' ? 'Identity Verified' : 'Verification Status Update',
      message: status === 'VERIFIED'
        ? 'Congratulations! Your TrustPay identity verification review has been approved.'
        : `Your verification review update: ${notes || status}`,
    });

    return review;
  }
}

module.exports = new UserAdministrationService();
