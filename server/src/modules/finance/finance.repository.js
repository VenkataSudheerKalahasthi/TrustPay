'use strict';

const { prisma } = require('../../config/database');

class FinanceRepository {
  // ─── Subscriptions & Plans ──────────────────────────────────
  async createSubscriptionPlan(data) {
    return prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description || null,
        priceMonthly: data.priceMonthly || 0,
        priceYearly: data.priceYearly || 0,
        billingCycle: data.billingCycle || 'MONTHLY',
        maxProjects: data.maxProjects || 10,
        maxUsers: data.maxUsers || 5,
        features: data.features || [],
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
      },
    });
  }

  async findSubscriptionPlans() {
    return prisma.subscriptionPlan.findMany({ orderBy: { priceMonthly: 'asc' } });
  }

  async createOrganizationSubscription(data) {
    const count = await prisma.organizationSubscription.count();
    const subscriptionNumber = `SUB-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return prisma.organizationSubscription.create({
      data: {
        subscriptionNumber,
        userId: data.userId,
        organizationId: data.organizationId || null,
        planId: data.planId,
        status: 'ACTIVE',
        billingCycle: data.billingCycle || 'MONTHLY',
        currentPeriodStart,
        currentPeriodEnd,
      },
      include: {
        plan: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findOrganizationSubscriptionByUserId(userId) {
    return prisma.organizationSubscription.findFirst({
      where: { userId },
      include: {
        plan: true,
        invoices: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Billing Profiles & Payment Methods ─────────────────────
  async upsertBillingProfile(userId, data) {
    return prisma.billingProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        billingEmail: data.billingEmail,
        companyName: data.companyName || null,
        gstNumber: data.gstNumber || null,
        taxId: data.taxId || null,
        billingAddress: data.billingAddress || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || 'India',
        postalCode: data.postalCode || null,
      },
      include: { paymentMethods: true },
    });
  }

  async findBillingProfileByUserId(userId) {
    return prisma.billingProfile.findUnique({
      where: { userId },
      include: { paymentMethods: true },
    });
  }

  async addPaymentMethod(data) {
    return prisma.paymentMethod.create({
      data: {
        billingProfileId: data.billingProfileId,
        userId: data.userId,
        type: data.type || 'CARD',
        provider: data.provider || 'RAZORPAY',
        accountLast4: data.accountLast4 || '4242',
        expiryMonth: data.expiryMonth || 12,
        expiryYear: data.expiryYear || 2028,
        isDefault: data.isDefault || false,
      },
    });
  }

  // ─── Subscription Invoices ──────────────────────────────────
  async createSubscriptionInvoice(data) {
    const count = await prisma.subscriptionInvoice.count();
    const invoiceNumber = `INV-SUB-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.subscriptionInvoice.create({
      data: {
        invoiceNumber,
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        taxAmount: data.taxAmount || 0,
        totalAmount: data.amount + (data.taxAmount || 0),
        currency: data.currency || 'INR',
        status: data.status || 'PAID',
        dueDate: data.dueDate || new Date(),
        paidAt: data.paidAt || new Date(),
      },
    });
  }

  // ─── Commission Rules & Transactions ───────────────────────
  async createCommissionRule(data) {
    return prisma.commissionRule.create({
      data: {
        name: data.name,
        code: data.code,
        type: data.type || 'PERCENTAGE',
        rate: data.rate || 5.0,
        fixedAmount: data.fixedAmount || 0.0,
        minCommission: data.minCommission || 0.0,
        maxCommission: data.maxCommission || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async findCommissionRules() {
    return prisma.commissionRule.findMany({ where: { isActive: true } });
  }

  async createCommissionTransaction(data) {
    const count = await prisma.commissionTransaction.count();
    const transactionNumber = `COMM-TXN-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.commissionTransaction.create({
      data: {
        transactionNumber,
        ruleId: data.ruleId || null,
        contractId: data.contractId || null,
        escrowReleaseId: data.escrowReleaseId || null,
        grossAmount: data.grossAmount,
        commissionAmount: data.commissionAmount,
        netAmount: data.grossAmount - data.commissionAmount,
        currency: data.currency || 'INR',
      },
    });
  }

  // ─── Financial Ledgers (Revenue & Expense) ──────────────────
  async createRevenueEntry(data) {
    const count = await prisma.revenueLedger.count();
    const ledgerNumber = `REV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.revenueLedger.create({
      data: {
        ledgerNumber,
        userId: data.userId || null,
        organizationId: data.organizationId || null,
        entryType: 'REVENUE',
        category: data.category || 'SUBSCRIPTION',
        amount: data.amount,
        currency: data.currency || 'INR',
        description: data.description || null,
      },
    });
  }

  async createExpenseEntry(data) {
    const count = await prisma.expenseLedger.count();
    const ledgerNumber = `EXP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.expenseLedger.create({
      data: {
        ledgerNumber,
        userId: data.userId || null,
        organizationId: data.organizationId || null,
        entryType: 'EXPENSE',
        category: data.category || 'OPERATIONS',
        amount: data.amount,
        currency: data.currency || 'INR',
        description: data.description || null,
      },
    });
  }

  async findRevenueEntries() {
    return prisma.revenueLedger.findMany({ orderBy: { transactionDate: 'desc' } });
  }

  async findExpenseEntries() {
    return prisma.expenseLedger.findMany({ orderBy: { transactionDate: 'desc' } });
  }

  // ─── Budgets & Allocations ──────────────────────────────────
  async createBudget(data, userId) {
    const count = await prisma.budget.count();
    const budgetNumber = `BGT-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.budget.create({
      data: {
        budgetNumber,
        userId,
        organizationId: data.organizationId || null,
        title: data.title,
        fiscalYear: data.fiscalYear || 2026,
        totalBudget: data.totalBudget,
        spentAmount: 0,
        status: 'ACTIVE',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        allocations: {
          create: (data.allocations || []).map((alloc) => ({
            department: alloc.department,
            allocated: alloc.allocated,
            spent: 0,
          })),
        },
      },
      include: { allocations: true },
    });
  }

  async findBudgets(filter = {}) {
    const where = {};
    if (filter.userId) {
      where.userId = filter.userId;
    }
    if (filter.status) {
      where.status = filter.status;
    }

    return prisma.budget.findMany({
      where,
      include: { allocations: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Financial Reports & Business Metrics ───────────────────
  async createFinancialReport(data, generatedById) {
    return prisma.financialReport.create({
      data: {
        title: data.title,
        reportType: data.reportType || 'PROFIT_LOSS',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalRevenue: data.totalRevenue || 0,
        totalExpense: data.totalExpense || 0,
        netProfit: (data.totalRevenue || 0) - (data.totalExpense || 0),
        summaryData: data.summaryData ? JSON.stringify(data.summaryData) : null,
        generatedById,
      },
    });
  }

  async findFinancialReports() {
    return prisma.financialReport.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async upsertBusinessMetric(key, value, unit = 'INR') {
    return prisma.businessMetric.upsert({
      where: { metricKey: key },
      update: { metricValue: value, unit, calculatedAt: new Date() },
      create: { metricKey: key, metricValue: value, unit },
    });
  }

  async findBusinessMetrics() {
    return prisma.businessMetric.findMany();
  }
}

module.exports = new FinanceRepository();
