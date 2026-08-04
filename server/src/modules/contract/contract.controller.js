'use strict';

const contractService = require('./contract.service');

class ContractController {
  async createContract(req, res) {
    const userId = req.user.id;
    const contract = await contractService.createContract(userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      data: contract,
    });
  }

  async getContractById(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const contract = await contractService.getContractById(id, userId, role);
    res.status(200).json({
      success: true,
      data: contract,
    });
  }

  async updateContract(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const updated = await contractService.updateContract(id, userId, role, req.body);
    res.status(200).json({
      success: true,
      message: 'Contract updated successfully',
      data: updated,
    });
  }

  async signContract(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const signature = await contractService.signContract(id, userId, role, ipAddress, userAgent);
    res.status(200).json({
      success: true,
      message: 'Contract digitally signed successfully',
      data: signature,
    });
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const contract = await contractService.updateStatus(id, userId, role, status, reason);
    res.status(200).json({
      success: true,
      message: `Contract status updated to ${status}`,
      data: contract,
    });
  }

  async downloadPdf(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const pdfBuffer = await contractService.generatePdf(id, userId, role);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contract-${id}.pdf`);
    res.status(200).send(pdfBuffer);
  }

  async searchContracts(req, res) {
    const userId = req.user.id;
    const role = req.user.role;
    const result = await contractService.searchContracts(userId, role, req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getTemplates(req, res) {
    const templates = await contractService.getTemplates();
    res.status(200).json({
      success: true,
      data: templates,
    });
  }
}

module.exports = new ContractController();
