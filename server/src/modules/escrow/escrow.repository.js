'use strict';

const { prisma } = require('../../config/database');

const inMemoryWallets = new Map();
const inMemoryTransactions = new Map();
const inMemoryDeposits = new Map();
const inMemoryReleases = new Map();
const inMemoryRefunds = new Map();
const inMemoryInvoices = new Map();
const inMemoryEvents = new Map();

class EscrowRepository {
  async getOrCreateWallet(clientProfileId) {
    try {
      let wallet = await prisma.escrowWallet.findUnique({
        where: { clientProfileId },
        include: { clientProfile: true },
      });
      if (!wallet) {
        wallet = await prisma.escrowWallet.create({
          data: { clientProfileId },
          include: { clientProfile: true },
        });
      }
      return wallet;
    } catch {
      let wallet = inMemoryWallets.get(clientProfileId);
      if (!wallet) {
        wallet = {
          id: `wlt_${Date.now()}`,
          clientProfileId,
          status: 'ACTIVE',
          currency: 'INR',
          minorUnits: 100,
          exchangeRate: 1.0,
          totalBalance: 0,
          availableBalance: 0,
          heldBalance: 0,
          releasedBalance: 0,
          refundedBalance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        inMemoryWallets.set(clientProfileId, wallet);
      }
      return wallet;
    }
  }

  async getWalletById(id) {
    try {
      return await prisma.escrowWallet.findUnique({
        where: { id },
        include: { clientProfile: { include: { user: true } } },
      });
    } catch {
      for (const w of inMemoryWallets.values()) {
        if (w.id === id) {
          return w;
        }
      }
      return null;
    }
  }

  async updateWalletBalances(id, balances) {
    try {
      return await prisma.escrowWallet.update({
        where: { id },
        data: { ...balances, updatedAt: new Date() },
      });
    } catch {
      for (const [cId, w] of inMemoryWallets.entries()) {
        if (w.id === id) {
          Object.assign(w, balances, { updatedAt: new Date() });
          inMemoryWallets.set(cId, w);
          return w;
        }
      }
      return balances;
    }
  }

  async createTransaction(transactionData) {
    try {
      return await prisma.walletTransaction.create({
        data: transactionData,
      });
    } catch {
      const tx = {
        id: `tx_${Date.now()}`,
        ...transactionData,
        createdAt: new Date(),
      };
      inMemoryTransactions.set(tx.id, tx);
      return tx;
    }
  }

  async findTransactionByIdempotencyKey(key) {
    if (!key) {
      return null;
    }
    try {
      return await prisma.walletTransaction.findUnique({
        where: { idempotencyKey: key },
      });
    } catch {
      for (const tx of inMemoryTransactions.values()) {
        if (tx.idempotencyKey === key) {
          return tx;
        }
      }
      return null;
    }
  }

  async createDeposit(depositData) {
    try {
      return await prisma.escrowDeposit.create({
        data: depositData,
      });
    } catch {
      const dep = {
        id: `dep_${Date.now()}`,
        ...depositData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDeposits.set(dep.razorpayOrderId, dep);
      return dep;
    }
  }

  async findDepositByOrderId(orderId) {
    try {
      return await prisma.escrowDeposit.findUnique({
        where: { razorpayOrderId: orderId },
      });
    } catch {
      return inMemoryDeposits.get(orderId) || null;
    }
  }

  async updateDepositStatus(orderId, updateData) {
    try {
      return await prisma.escrowDeposit.update({
        where: { razorpayOrderId: orderId },
        data: { ...updateData, updatedAt: new Date() },
      });
    } catch {
      const dep = inMemoryDeposits.get(orderId);
      if (dep) {
        Object.assign(dep, updateData, { updatedAt: new Date() });
      }
      return dep || updateData;
    }
  }

  async createRelease(releaseData) {
    try {
      return await prisma.escrowRelease.create({ data: releaseData });
    } catch {
      const rel = { id: `rel_${Date.now()}`, ...releaseData, createdAt: new Date() };
      inMemoryReleases.set(rel.id, rel);
      return rel;
    }
  }

  async createRefund(refundData) {
    try {
      return await prisma.escrowRefund.create({ data: refundData });
    } catch {
      const ref = { id: `ref_${Date.now()}`, ...refundData, createdAt: new Date() };
      inMemoryRefunds.set(ref.id, ref);
      return ref;
    }
  }

  async createPaymentEvent(eventData) {
    try {
      return await prisma.paymentEvent.create({ data: eventData });
    } catch {
      const ev = { id: `evt_${Date.now()}`, ...eventData, createdAt: new Date() };
      inMemoryEvents.set(ev.id, ev);
      return ev;
    }
  }

  async getNextInvoiceNumber() {
    try {
      const year = new Date().getFullYear();
      const count = await prisma.invoice.count({
        where: { invoiceNumber: { startsWith: `INV-${year}` } },
      });
      const seq = String(count + 1).padStart(6, '0');
      return `INV-${year}-${seq}`;
    } catch {
      const year = new Date().getFullYear();
      const seq = String(inMemoryInvoices.size + 1).padStart(6, '0');
      return `INV-${year}-${seq}`;
    }
  }

  async createInvoice(invoiceData) {
    try {
      return await prisma.invoice.create({ data: invoiceData });
    } catch {
      const inv = { id: `inv_${Date.now()}`, ...invoiceData, createdAt: new Date() };
      inMemoryInvoices.set(inv.id, inv);
      return inv;
    }
  }

  async findInvoiceById(id) {
    try {
      return await prisma.invoice.findUnique({
        where: { id },
        include: {
          clientProfile: { include: { user: true } },
          workerProfile: { include: { user: true } },
          contract: true,
        },
      });
    } catch {
      return inMemoryInvoices.get(id) || null;
    }
  }

  async searchTransactions({ escrowWalletId, type, contractId, sort, page = 1, limit = 10 }) {
    try {
      const where = { escrowWalletId };
      if (type) {
        where.type = type;
      }
      if (contractId) {
        where.contractId = contractId;
      }

      let orderBy = { createdAt: 'desc' };
      if (sort === 'oldest') {
        orderBy = { createdAt: 'asc' };
      }
      if (sort === 'amount_asc') {
        orderBy = { amount: 'asc' };
      }
      if (sort === 'amount_desc') {
        orderBy = { amount: 'desc' };
      }

      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        prisma.walletTransaction.findMany({
          where,
          include: { contract: { select: { contractNumber: true, title: true } } },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.walletTransaction.count({ where }),
      ]);

      return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
    } catch {
      const list = Array.from(inMemoryTransactions.values()).filter((t) => t.escrowWalletId === escrowWalletId);
      return { transactions: list, total: list.length, page: 1, limit, totalPages: 1 };
    }
  }

  async searchInvoices({ escrowWalletId, clientProfileId, workerProfileId, page = 1, limit = 10 }) {
    try {
      const where = {};
      if (escrowWalletId) {
        where.escrowWalletId = escrowWalletId;
      }
      if (clientProfileId) {
        where.clientProfileId = clientProfileId;
      }
      if (workerProfileId) {
        where.workerProfileId = workerProfileId;
      }

      const skip = (page - 1) * limit;

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: { contract: { select: { contractNumber: true, title: true } } },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.invoice.count({ where }),
      ]);

      return { invoices, total, page, limit, totalPages: Math.ceil(total / limit) };
    } catch {
      const list = Array.from(inMemoryInvoices.values());
      return { invoices: list, total: list.length, page: 1, limit, totalPages: 1 };
    }
  }
}

module.exports = new EscrowRepository();
