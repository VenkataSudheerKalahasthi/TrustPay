'use strict';

const adminRepository = require('./admin.repository');

class ContractAdministrationService {
  async getContractsOversight() {
    return adminRepository.findContractsOversight();
  }

  async updateContractOversight(data, adminId) {
    const oversight = await adminRepository.updateContractOversight(data);
    await adminRepository.logAdminAction(adminId, 'UPDATE_CONTRACT_OVERSIGHT', 'CONTRACT', data.contractId, data);
    return oversight;
  }
}

module.exports = new ContractAdministrationService();
