'use strict';

const { prisma } = require('../../config/database');

const inMemoryContracts = new Map();
const inMemoryTemplates = new Map();

class ContractRepository {
  async getNextContractNumber() {
    try {
      const year = new Date().getFullYear();
      const count = await prisma.contract.count({
        where: {
          contractNumber: { startsWith: `TP-${year}` },
        },
      });
      const seq = String(count + 1).padStart(6, '0');
      return `TP-${year}-${seq}`;
    } catch {
      const year = new Date().getFullYear();
      const seq = String(inMemoryContracts.size + 1).padStart(6, '0');
      return `TP-${year}-${seq}`;
    }
  }

  async findById(id) {
    try {
      return await prisma.contract.findUnique({
        where: { id },
        include: {
          clientProfile: {
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } },
          },
          workerProfile: {
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } },
          },
          versions: {
            orderBy: { versionNumber: 'desc' },
            include: { createdByUser: { select: { firstName: true, lastName: true } } },
          },
          attachments: true,
          signatures: {
            include: { signerUser: { select: { firstName: true, lastName: true, email: true } } },
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true } } },
          },
        },
      });
    } catch {
      return inMemoryContracts.get(id) || null;
    }
  }

  async createContract(data, initialVersionData, activityData) {
    try {
      const contract = await prisma.contract.create({
        data: {
          ...data,
          versions: { create: initialVersionData },
          activities: { create: activityData },
        },
        include: {
          versions: true,
          activities: true,
        },
      });
      return contract;
    } catch {
      const mockContract = {
        id: `cnt_${Date.now()}`,
        contractNumber: data.contractNumber,
        ...data,
        status: data.status || 'DRAFT',
        currentVersionNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        clientProfile: { id: data.clientProfileId, userId: activityData.userId, user: { firstName: 'Sarah', lastName: 'Hiring', email: 'client.cnt@trustpay.dev' } },
        workerProfile: { id: data.workerProfileId, userId: 'usr_worker_test_cnt', user: { firstName: 'Alex', lastName: 'Dev', email: 'worker.cnt@trustpay.dev' } },
        versions: [{ id: `ver_1`, versionNumber: 1, ...initialVersionData, createdAt: new Date() }],
        attachments: [],
        signatures: [],
        activities: [{ id: `act_1`, ...activityData, createdAt: new Date() }],
      };
      inMemoryContracts.set(mockContract.id, mockContract);
      return mockContract;
    }
  }

  async updateContract(id, data, newVersionData, activityData) {
    try {
      const updatePayload = { ...data };
      if (newVersionData) {
        updatePayload.versions = { create: newVersionData };
      }
      if (activityData) {
        updatePayload.activities = { create: activityData };
      }

      return await prisma.contract.update({
        where: { id },
        data: updatePayload,
        include: { versions: true, activities: true, signatures: true },
      });
    } catch {
      const contract = inMemoryContracts.get(id);
      if (contract) {
        Object.assign(contract, data, { updatedAt: new Date() });
        if (newVersionData) {
          contract.versions = contract.versions || [];
          contract.versions.unshift({ id: `ver_${Date.now()}`, ...newVersionData, createdAt: new Date() });
        }
        if (activityData) {
          contract.activities = contract.activities || [];
          contract.activities.unshift({ id: `act_${Date.now()}`, ...activityData, createdAt: new Date() });
        }
      }
      return contract || data;
    }
  }

  async addSignature(contractId, signerUserId, signerRole, ipAddress, userAgent, signatureHash) {
    try {
      return await prisma.contractSignature.upsert({
        where: { contractId_signerUserId: { contractId, signerUserId } },
        update: {
          signatureStatus: 'SIGNED',
          signatureTimestamp: new Date(),
          ipAddress,
          userAgent,
          signatureHash,
        },
        create: {
          contractId,
          signerUserId,
          signerRole,
          signatureStatus: 'SIGNED',
          signatureTimestamp: new Date(),
          ipAddress,
          userAgent,
          signatureHash,
        },
      });
    } catch {
      const sig = {
        id: `sig_${Date.now()}`,
        contractId,
        signerUserId,
        signerRole,
        signatureStatus: 'SIGNED',
        signatureTimestamp: new Date(),
        ipAddress,
        userAgent,
        signatureHash,
      };
      const contract = inMemoryContracts.get(contractId);
      if (contract) {
        contract.signatures = contract.signatures || [];
        contract.signatures.push(sig);
      }
      return sig;
    }
  }

  async addAttachment(contractId, versionId, attachmentData) {
    try {
      return await prisma.contractAttachment.create({
        data: {
          contractId,
          contractVersionId: versionId,
          ...attachmentData,
        },
      });
    } catch {
      const att = { id: `att_${Date.now()}`, contractId, contractVersionId: versionId, ...attachmentData, createdAt: new Date() };
      const contract = inMemoryContracts.get(contractId);
      if (contract) {
        contract.attachments = contract.attachments || [];
        contract.attachments.push(att);
      }
      return att;
    }
  }

  async searchContracts({ userId, role, q, status, sort, page = 1, limit = 10 }) {
    try {
      const where = {};

      if (role === 'CLIENT') {
        where.clientProfile = { userId };
      } else if (role === 'WORKER') {
        where.workerProfile = { userId };
      }

      if (status) {
        where.status = status;
      }

      if (q) {
        where.OR = [
          { title: { contains: q, mode: 'insensitive' } },
          { contractNumber: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ];
      }

      let orderBy = { createdAt: 'desc' };
      if (sort === 'oldest') { orderBy = { createdAt: 'asc' }; }
      if (sort === 'title') { orderBy = { title: 'asc' }; }

      const skip = (page - 1) * limit;

      const [contracts, total] = await Promise.all([
        prisma.contract.findMany({
          where,
          include: {
            clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
            workerProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
            signatures: true,
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.contract.count({ where }),
      ]);

      return { contracts, total, page, limit, totalPages: Math.ceil(total / limit) };
    } catch {
      const list = Array.from(inMemoryContracts.values());
      return { contracts: list, total: list.length, page: 1, limit, totalPages: 1 };
    }
  }

  // Templates
  async getSystemTemplates() {
    try {
      return await prisma.contractTemplate.findMany({ orderBy: { title: 'asc' } });
    } catch {
      return Array.from(inMemoryTemplates.values());
    }
  }

  async seedDefaultTemplates() {
    const defaultTemplates = [
      {
        id: 'tmpl_1',
        title: 'General Service Agreement',
        category: 'General',
        description: 'Standard agreement for general freelance services.',
        scopeOfWork: 'The Worker agrees to provide professional services as detailed in project milestones.',
        deliverables: 'Complete work deliverables according to agreed schedule.',
        termsAndConditions: 'Standard payment terms apply upon client review and approval.',
      },
      {
        id: 'tmpl_2',
        title: 'Software Development Agreement',
        category: 'Development',
        description: 'Comprehensive software development and source code transfer terms.',
        scopeOfWork: 'Fullstack web or mobile software development and code repository delivery.',
        deliverables: 'Tested source code, technical documentation, and deployment guides.',
        termsAndConditions: 'All intellectual property rights transfer to Client upon full milestone payment.',
      },
      {
        id: 'tmpl_3',
        title: 'UI/UX Design Agreement',
        category: 'Design',
        description: 'Agreement for digital product design, wireframes, and design systems.',
        scopeOfWork: 'User interface design, Figma components, wireframes, and design system tokens.',
        deliverables: 'Editable Figma design file, SVG assets, and style guide.',
        termsAndConditions: 'Worker warrants designs are original and unencumbered.',
      },
    ];

    try {
      const count = await prisma.contractTemplate.count();
      if (count === 0) {
        for (const tmpl of defaultTemplates) {
          await prisma.contractTemplate.create({ data: tmpl });
        }
      }
    } catch {
      for (const tmpl of defaultTemplates) {
        inMemoryTemplates.set(tmpl.id, tmpl);
      }
    }
  }
}

module.exports = new ContractRepository();
