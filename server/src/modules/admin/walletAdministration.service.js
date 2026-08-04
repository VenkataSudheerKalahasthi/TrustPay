'use strict';

const adminRepository = require('./admin.repository');

class WalletAdministrationService {
  async getWalletsOversight() {
    return adminRepository.findWalletsOversight();
  }

  async updateWalletOversight(data, adminId) {
    const oversight = await adminRepository.updateWalletOversight(data);
    await adminRepository.logAdminAction(adminId, 'UPDATE_WALLET_OVERSIGHT', 'WALLET', data.walletId, data);
    return oversight;
  }
}

module.exports = new WalletAdministrationService();
