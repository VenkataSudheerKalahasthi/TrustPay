'use strict';

const escrowService = require('./escrow.service');

class EscrowController {
  async getWallet(req, res) {
    const userId = req.user.id;
    const wallet = await escrowService.getWalletByUserId(userId);
    res.status(200).json({
      success: true,
      data: wallet,
    });
  }

  async createDepositOrder(req, res) {
    const userId = req.user.id;
    const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;
    const result = await escrowService.createDepositOrder(userId, {
      ...req.body,
      idempotencyKey,
    });

    res.status(201).json({
      success: true,
      message: 'Deposit order created successfully',
      data: result,
    });
  }

  async verifyPayment(req, res) {
    const userId = req.user.id;
    const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;
    const result = await escrowService.verifyPayment(userId, {
      ...req.body,
      idempotencyKey,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and funds added to escrow wallet',
      data: result,
    });
  }

  async releaseFunds(req, res) {
    const userId = req.user.id;
    const role = req.user.role;
    const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;
    const result = await escrowService.releaseFunds(userId, role, {
      ...req.body,
      idempotencyKey,
    });

    res.status(200).json({
      success: true,
      message: 'Escrow funds released successfully',
      data: result,
    });
  }

  async refundFunds(req, res) {
    const userId = req.user.id;
    const role = req.user.role;
    const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;
    const result = await escrowService.refundFunds(userId, role, {
      ...req.body,
      idempotencyKey,
    });

    res.status(200).json({
      success: true,
      message: 'Escrow funds refunded successfully',
      data: result,
    });
  }

  async searchTransactions(req, res) {
    const userId = req.user.id;
    const result = await escrowService.searchTransactions(userId, req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async searchInvoices(req, res) {
    const userId = req.user.id;
    const result = await escrowService.searchInvoices(userId, req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async downloadInvoicePdf(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const pdfBuffer = await escrowService.generateInvoicePdf(id, userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
    res.status(200).send(pdfBuffer);
  }
}

module.exports = new EscrowController();
