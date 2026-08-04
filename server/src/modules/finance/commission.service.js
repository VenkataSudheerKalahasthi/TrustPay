'use strict';

const financeRepository = require('./finance.repository');

class CommissionService {
  async createCommissionRule(data) {
    return financeRepository.createCommissionRule(data);
  }

  async getCommissionRules() {
    return financeRepository.findCommissionRules();
  }

  /**
   * Deterministic Marketplace & Escrow Commission Engine
   */
  async calculateAndRecordCommission(grossAmount, contractId = null, escrowReleaseId = null) {
    const rules = await financeRepository.findCommissionRules();
    const rule = rules[0] || { rate: 5.0 }; // Default 5% platform fee

    const commissionAmount = Math.round((grossAmount * (rule.rate / 100)) * 100) / 100;

    const transaction = await financeRepository.createCommissionTransaction({
      ruleId: rule.id || null,
      contractId,
      escrowReleaseId,
      grossAmount,
      commissionAmount,
    });

    await financeRepository.createRevenueEntry({
      category: 'ESCROW_COMMISSION',
      amount: commissionAmount,
      description: `Platform fee on transaction #${transaction.transactionNumber} (Gross: ₹${grossAmount})`,
    });

    return transaction;
  }
}

module.exports = new CommissionService();
