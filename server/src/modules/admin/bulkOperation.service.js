'use strict';

const adminRepository = require('./admin.repository');
const userAdministrationService = require('./userAdministration.service');

class BulkOperationService {
  async executeBulkOperation(data, adminId) {
    const { operationType, targetUserIds } = data;
    const op = await adminRepository.createBulkOperation(operationType, targetUserIds.length, data);

    let successCount = 0;
    let failureCount = 0;

    for (const userId of targetUserIds) {
      try {
        if (operationType === 'SUSPEND_USERS') {
          await userAdministrationService.toggleUserSuspension(userId, true, adminId);
        } else if (operationType === 'RESTORE_USERS') {
          await userAdministrationService.toggleUserSuspension(userId, false, adminId);
        } else if (operationType === 'VERIFY_USERS') {
          await userAdministrationService.reviewVerification(userId, adminId, 'VERIFIED', 'Bulk verification executed by admin');
        }
        successCount++;
      } catch {
        failureCount++;
      }
    }

    const updatedOp = await adminRepository.updateBulkOperationProgress(op.id, successCount, failureCount, 'COMPLETED');
    await adminRepository.logAdminAction(adminId, 'BULK_OPERATION', 'BULK', op.id, { operationType, successCount, failureCount });

    return updatedOp;
  }

  async getBulkOperations() {
    return adminRepository.getBulkOperations();
  }
}

module.exports = new BulkOperationService();
