'use strict';

const escrowRepository = require('./escrow.repository');
const razorpayService = require('../../services/razorpay.service');
const invoiceService = require('../../services/invoice.service');
const clientService = require('../client/client.service');

class EscrowService {
  async getWalletByUserId(userId) {
    const clientProfile = await clientService.getClientByUserId(userId);
    return escrowRepository.getOrCreateWallet(clientProfile.id);
  }

  async checkWalletActive(wallet) {
    if (wallet.status !== 'ACTIVE') {
      const err = new Error(`Wallet is currently ${wallet.status} and cannot process transactions`);
      err.statusCode = 400;
      throw err;
    }
  }

  async createDepositOrder(userId, { amount, currency = 'INR', contractId, idempotencyKey }) {
    // Idempotency Check
    if (idempotencyKey) {
      const existingTx = await escrowRepository.findTransactionByIdempotencyKey(idempotencyKey);
      if (existingTx) {
        return { isIdempotent: true, transaction: existingTx };
      }
    }

    const wallet = await this.getWalletByUserId(userId);
    await this.checkWalletActive(wallet);

    const receiptNumber = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const razorpayOrder = await razorpayService.createOrder(amount, receiptNumber);

    // Save Deposit Record
    const deposit = await escrowRepository.createDeposit({
      escrowWalletId: wallet.id,
      contractId: contractId || null,
      idempotencyKey: idempotencyKey || null,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency,
      status: 'PENDING',
      receiptNumber,
    });

    // Payment Event Log
    await escrowRepository.createPaymentEvent({
      idempotencyKey: idempotencyKey || null,
      eventType: 'ORDER_CREATED',
      gateway: 'RAZORPAY',
      gatewayOrderId: razorpayOrder.id,
      userId,
      payload: JSON.stringify(razorpayOrder),
      status: 'SUCCESS',
    });

    return { razorpayOrder, deposit };
  }

  async verifyPayment(userId, { razorpayOrderId, razorpayPaymentId, razorpaySignature, idempotencyKey }) {
    if (idempotencyKey) {
      const existingTx = await escrowRepository.findTransactionByIdempotencyKey(idempotencyKey);
      if (existingTx) {
        return { verified: true, transaction: existingTx };
      }
    }

    const isValid = razorpayService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      await escrowRepository.createPaymentEvent({
        eventType: 'PAYMENT_FAILURE',
        gatewayOrderId: razorpayOrderId,
        gatewayPaymentId: razorpayPaymentId,
        userId,
        status: 'FAILED',
        errorMessage: 'Invalid Razorpay Signature Verification',
      });

      const err = new Error('Invalid Razorpay payment signature verification failed');
      err.statusCode = 400;
      throw err;
    }

    const deposit = await escrowRepository.findDepositByOrderId(razorpayOrderId);
    if (!deposit) {
      const err = new Error('Deposit order reference not found');
      err.statusCode = 404;
      throw err;
    }

    if (deposit.status === 'COMPLETED') {
      return { verified: true, message: 'Payment already verified' };
    }

    const wallet = await escrowRepository.getWalletById(deposit.escrowWalletId);
    await this.checkWalletActive(wallet);

    // Double-Entry Ledger Calculation
    const amount = deposit.amount;
    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore + amount;
    const refNum = `TX-DEP-${Date.now()}`;

    // Update Wallet Balances
    const updatedWallet = await escrowRepository.updateWalletBalances(wallet.id, {
      availableBalance: balanceAfter,
      totalBalance: wallet.totalBalance + amount,
    });

    // Update Deposit Status
    await escrowRepository.updateDepositStatus(razorpayOrderId, {
      status: 'COMPLETED',
      razorpayPaymentId,
      razorpaySignature,
    });

    // Append-Only Ledger Entry
    const transaction = await escrowRepository.createTransaction({
      escrowWalletId: wallet.id,
      contractId: deposit.contractId,
      idempotencyKey: idempotencyKey || null,
      type: 'DEPOSIT',
      amount,
      currency: deposit.currency,
      balanceBefore,
      balanceAfter,
      referenceNumber: refNum,
      description: `Fund deposit via Razorpay payment ${razorpayPaymentId}`,
      actorUserId: userId,
    });

    // Create Invoice for Deposit
    const invoiceNum = await escrowRepository.getNextInvoiceNumber();
    const invoice = await escrowRepository.createInvoice({
      invoiceNumber: invoiceNum,
      contractId: deposit.contractId,
      escrowWalletId: wallet.id,
      clientProfileId: wallet.clientProfileId,
      amount,
      totalAmount: amount,
      currency: deposit.currency,
      paymentDetailsText: `Paid via Razorpay (${razorpayPaymentId}). Order ID: ${razorpayOrderId}`,
    });

    // Payment Event Log
    await escrowRepository.createPaymentEvent({
      idempotencyKey: idempotencyKey || null,
      eventType: 'PAYMENT_SUCCESS',
      gatewayOrderId: razorpayOrderId,
      gatewayPaymentId: razorpayPaymentId,
      userId,
      status: 'SUCCESS',
    });

    return { verified: true, wallet: updatedWallet, transaction, invoice };
  }

  async releaseFunds(userId, role, { contractId, workerProfileId, amount, releaseType = 'FULL', notes, idempotencyKey }) {
    if (idempotencyKey) {
      const existingTx = await escrowRepository.findTransactionByIdempotencyKey(idempotencyKey);
      if (existingTx) {
        return { released: true, transaction: existingTx };
      }
    }

    const wallet = await this.getWalletByUserId(userId);
    await this.checkWalletActive(wallet);

    if (wallet.availableBalance < amount) {
      const err = new Error(`Insufficient wallet balance. Available: ₹${wallet.availableBalance}, Requested: ₹${amount}`);
      err.statusCode = 400;
      throw err;
    }

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore - amount;
    const refNum = `TX-REL-${Date.now()}`;

    // Update Wallet Balances
    const updatedWallet = await escrowRepository.updateWalletBalances(wallet.id, {
      availableBalance: balanceAfter,
      releasedBalance: wallet.releasedBalance + amount,
    });

    // Create Release Record
    const release = await escrowRepository.createRelease({
      escrowWalletId: wallet.id,
      contractId,
      workerProfileId,
      idempotencyKey: idempotencyKey || null,
      amount,
      currency: 'INR',
      releaseType,
      notes,
      releasedByUserId: userId,
    });

    // Append-Only Ledger Entry
    const transaction = await escrowRepository.createTransaction({
      escrowWalletId: wallet.id,
      contractId,
      idempotencyKey: idempotencyKey || null,
      type: 'RELEASE',
      amount,
      currency: 'INR',
      balanceBefore,
      balanceAfter,
      referenceNumber: refNum,
      description: `Escrow release of ₹${amount} for contract deliverables. Notes: ${notes || 'N/A'}`,
      actorUserId: userId,
    });

    return { released: true, wallet: updatedWallet, release, transaction };
  }

  async refundFunds(userId, role, { contractId, amount, reason, idempotencyKey }) {
    if (idempotencyKey) {
      const existingTx = await escrowRepository.findTransactionByIdempotencyKey(idempotencyKey);
      if (existingTx) {
        return { refunded: true, transaction: existingTx };
      }
    }

    const wallet = await this.getWalletByUserId(userId);
    await this.checkWalletActive(wallet);

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore + amount;
    const refNum = `TX-REF-${Date.now()}`;

    // Update Wallet Balances
    const updatedWallet = await escrowRepository.updateWalletBalances(wallet.id, {
      availableBalance: balanceAfter,
      refundedBalance: wallet.refundedBalance + amount,
    });

    // Create Refund Record
    const refund = await escrowRepository.createRefund({
      escrowWalletId: wallet.id,
      contractId,
      clientProfileId: wallet.clientProfileId,
      idempotencyKey: idempotencyKey || null,
      amount,
      currency: 'INR',
      reason,
      status: 'COMPLETED',
      refundedByUserId: userId,
    });

    // Append-Only Ledger Entry
    const transaction = await escrowRepository.createTransaction({
      escrowWalletId: wallet.id,
      contractId,
      idempotencyKey: idempotencyKey || null,
      type: 'REFUND',
      amount,
      currency: 'INR',
      balanceBefore,
      balanceAfter,
      referenceNumber: refNum,
      description: `Escrow refund of ₹${amount}. Reason: ${reason}`,
      actorUserId: userId,
    });

    return { refunded: true, wallet: updatedWallet, refund, transaction };
  }

  async searchTransactions(userId, query) {
    const wallet = await this.getWalletByUserId(userId);
    return escrowRepository.searchTransactions({
      escrowWalletId: wallet.id,
      ...query,
    });
  }

  async searchInvoices(userId, query) {
    const clientProfile = await clientService.getClientByUserId(userId);
    return escrowRepository.searchInvoices({
      clientProfileId: clientProfile.id,
      ...query,
    });
  }

  async generateInvoicePdf(id, _userId) {
    const invoice = await escrowRepository.findInvoiceById(id);
    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    const pdfBuffer = await invoiceService.generateInvoicePdf(invoice);
    return pdfBuffer;
  }
}

module.exports = new EscrowService();
