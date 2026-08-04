'use strict';

const contractRepository = require('./contract.repository');
const pdfService = require('../../services/pdf.service');
const { createSha256Hash, generateSignatureHash } = require('../../utils/hash');
const clientService = require('../client/client.service');

class ContractService {
  checkContractPermission(contract, userId, role) {
    if (role === 'ADMIN') { return true; }
    const isClient = contract.clientProfile?.userId === userId;
    const isWorker = contract.workerProfile?.userId === userId;

    if (!isClient && !isWorker) {
      const err = new Error('Not authorized to access this contract');
      err.statusCode = 403;
      throw err;
    }
    return { isClient, isWorker };
  }

  async createContract(userId, contractData) {
    const clientProfile = await clientService.getClientByUserId(userId);
    const contractNumber = await contractRepository.getNextContractNumber();

    const contentHash = createSha256Hash({
      title: contractData.title,
      scopeOfWork: contractData.scopeOfWork,
      deliverables: contractData.deliverables,
      termsAndConditions: contractData.termsAndConditions,
    });

    const contractPayload = {
      contractNumber,
      clientProfileId: clientProfile.id,
      workerProfileId: contractData.workerProfileId,
      title: contractData.title,
      description: contractData.description,
      scopeOfWork: contractData.scopeOfWork,
      deliverables: contractData.deliverables,
      termsAndConditions: contractData.termsAndConditions,
      paymentTermsText: contractData.paymentTermsText,
      startDate: contractData.startDate ? new Date(contractData.startDate) : null,
      endDate: contractData.endDate ? new Date(contractData.endDate) : null,
      expirationDate: contractData.expirationDate ? new Date(contractData.expirationDate) : null,
      status: 'PENDING_ACCEPTANCE',
      contentHash,
    };

    const initialVersion = {
      versionNumber: 1,
      title: contractData.title,
      scopeOfWork: contractData.scopeOfWork,
      deliverables: contractData.deliverables,
      termsAndConditions: contractData.termsAndConditions,
      paymentTermsText: contractData.paymentTermsText,
      createdByUserId: userId,
      changeSummary: 'Initial Contract Draft Created',
    };

    const initialActivity = {
      userId,
      action: 'CREATED',
      previousStatus: 'DRAFT',
      newStatus: 'PENDING_ACCEPTANCE',
      details: `Contract ${contractNumber} created and submitted for worker acceptance.`,
    };

    const contract = await contractRepository.createContract(
      contractPayload,
      initialVersion,
      initialActivity
    );

    return contract;
  }

  async getContractById(id, userId, role) {
    const contract = await contractRepository.findById(id);
    if (!contract) {
      const err = new Error('Contract not found');
      err.statusCode = 404;
      throw err;
    }

    this.checkContractPermission(contract, userId, role);
    return contract;
  }

  async updateContract(id, userId, role, updateData) {
    const contract = await this.getContractById(id, userId, role);

    // Enforce Immutability for Accepted & Archived contracts
    if (contract.status === 'ACCEPTED' || contract.status === 'ARCHIVED') {
      const err = new Error('Accepted or Archived contracts are immutable and cannot be overwritten directly');
      err.statusCode = 400;
      throw err;
    }

    const nextVersionNumber = (contract.currentVersionNumber || 1) + 1;
    const contentHash = createSha256Hash({
      title: updateData.title || contract.title,
      scopeOfWork: updateData.scopeOfWork || contract.scopeOfWork,
      deliverables: updateData.deliverables || contract.deliverables,
      termsAndConditions: updateData.termsAndConditions || contract.termsAndConditions,
    });

    const updatePayload = {
      title: updateData.title || contract.title,
      description: updateData.description !== undefined ? updateData.description : contract.description,
      scopeOfWork: updateData.scopeOfWork || contract.scopeOfWork,
      deliverables: updateData.deliverables || contract.deliverables,
      termsAndConditions: updateData.termsAndConditions || contract.termsAndConditions,
      paymentTermsText: updateData.paymentTermsText !== undefined ? updateData.paymentTermsText : contract.paymentTermsText,
      currentVersionNumber: nextVersionNumber,
      contentHash,
    };

    const newVersionData = {
      versionNumber: nextVersionNumber,
      title: updatePayload.title,
      scopeOfWork: updatePayload.scopeOfWork,
      deliverables: updatePayload.deliverables,
      termsAndConditions: updatePayload.termsAndConditions,
      paymentTermsText: updatePayload.paymentTermsText,
      createdByUserId: userId,
      changeSummary: updateData.changeSummary || `Version ${nextVersionNumber} updated by user`,
    };

    const activityData = {
      userId,
      action: 'VERSION_CREATED',
      previousStatus: contract.status,
      newStatus: contract.status,
      details: `Updated contract version to v${nextVersionNumber}. Summary: ${newVersionData.changeSummary}`,
    };

    return contractRepository.updateContract(id, updatePayload, newVersionData, activityData);
  }

  async signContract(id, userId, role, ipAddress, userAgent) {
    const contract = await this.getContractById(id, userId, role);

    const sigHash = generateSignatureHash({
      contractNumber: contract.contractNumber,
      signerUserId: userId,
      signerRole: role,
      ipAddress: ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    const signature = await contractRepository.addSignature(
      id,
      userId,
      role,
      ipAddress,
      userAgent,
      sigHash
    );

    // If both Client & Worker have signed, transition status to ACCEPTED
    const updatedContract = await contractRepository.findById(id);
    const signedCount = updatedContract.signatures.filter((s) => s.signatureStatus === 'SIGNED').length;

    if (signedCount >= 2 && updatedContract.status !== 'ACCEPTED') {
      await contractRepository.updateContract(
        id,
        { status: 'ACCEPTED', acceptedAt: new Date(), signatureHash: sigHash },
        null,
        {
          userId,
          action: 'ACCEPTED',
          previousStatus: updatedContract.status,
          newStatus: 'ACCEPTED',
          details: `Contract ${contract.contractNumber} fully executed and signed by both parties.`,
        }
      );
    }

    return signature;
  }

  async updateStatus(id, userId, role, newStatus, reason) {
    const contract = await this.getContractById(id, userId, role);

    const activityData = {
      userId,
      action: newStatus,
      previousStatus: contract.status,
      newStatus,
      reason,
      details: `Status transitioned from ${contract.status} to ${newStatus}`,
    };

    const updatePayload = { status: newStatus };
    if (newStatus === 'REJECTED') { updatePayload.rejectedAt = new Date(); }
    if (newStatus === 'CANCELLED') { updatePayload.cancelledAt = new Date(); }

    return contractRepository.updateContract(id, updatePayload, null, activityData);
  }

  async generatePdf(id, userId, role) {
    const contract = await this.getContractById(id, userId, role);
    const pdfBuffer = await pdfService.generateContractPdf(contract);

    const pdfHash = createSha256Hash(pdfBuffer);
    await contractRepository.updateContract(id, { pdfHash }, null, {
      userId,
      action: 'DOWNLOADED',
      details: `Contract PDF generated and downloaded. SHA-256: ${pdfHash}`,
    });

    return pdfBuffer;
  }

  async searchContracts(userId, role, query) {
    return contractRepository.searchContracts({
      userId,
      role,
      ...query,
    });
  }

  async getTemplates() {
    await contractRepository.seedDefaultTemplates();
    return contractRepository.getSystemTemplates();
  }
}

module.exports = new ContractService();
