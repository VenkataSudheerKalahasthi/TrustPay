'use strict';

const { prisma } = require('../../config/database');

class CollaborationRepository {
  async createRequest(data) {
    const count = await prisma.collaborationRequest.count();
    const requestNumber = `REQ-2026-${String(count + 1).padStart(6, '0')}`;

    return prisma.collaborationRequest.create({
      data: {
        requestNumber,
        clientProfileId: data.clientProfileId,
        workerProfileId: data.workerProfileId,
        projectTitle: data.projectTitle,
        projectDescription: data.projectDescription,
        budget: parseFloat(data.budget),
        estimatedDuration: data.estimatedDuration,
        expectedStartDate: data.expectedStartDate ? new Date(data.expectedStartDate) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        additionalNotes: data.additionalNotes || null,
        status: 'PENDING',
      },
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
      },
    });
  }

  async getRequestById(id) {
    return prisma.collaborationRequest.findUnique({
      where: { id },
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workspace: true,
      },
    });
  }

  async listRequestsForUser(clientProfileId, workerProfileId) {
    const whereOr = [];
    if (clientProfileId) {
      whereOr.push({ clientProfileId });
    }
    if (workerProfileId) {
      whereOr.push({ workerProfileId });
    }

    return prisma.collaborationRequest.findMany({
      where: { OR: whereOr },
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workspace: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRequestStatus(id, status, rejectionReason = null) {
    return prisma.collaborationRequest.update({
      where: { id },
      data: {
        status,
        rejectionReason: rejectionReason || null,
      },
    });
  }

  async createWorkspace(data) {
    const count = await prisma.collaborationWorkspace.count();
    const workspaceNumber = `WS-2026-${String(count + 1).padStart(6, '0')}`;

    return prisma.collaborationWorkspace.create({
      data: {
        workspaceNumber,
        requestId: data.requestId || null,
        clientProfileId: data.clientProfileId,
        workerProfileId: data.workerProfileId,
        projectId: data.projectId || null,
        contractId: data.contractId || null,
        conversationId: data.conversationId || null,
        escrowWalletId: data.escrowWalletId || null,
        status: 'PLANNING',
      },
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        request: true,
        planningBoard: true,
        project: {
          include: {
            milestones: { include: { deliverables: true } },
            deliverables: true,
          },
        },
        contract: {
          include: {
            signatures: true,
          },
        },
        conversation: true,
        certificates: true,
      },
    });
  }

  async getWorkspaceById(id) {
    return prisma.collaborationWorkspace.findUnique({
      where: { id },
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        request: true,
        planningBoard: true,
        project: {
          include: {
            milestones: {
              orderBy: { order: 'asc' },
              include: { deliverables: true },
            },
            deliverables: true,
          },
        },
        contract: {
          include: {
            signatures: {
              include: {
                signerUser: { select: { id: true, firstName: true, lastName: true, email: true } },
              },
            },
          },
        },
        conversation: true,
        escrowWallet: true,
        certificates: true,
      },
    });
  }

  async listWorkspacesForUser(clientProfileId, workerProfileId) {
    const whereOr = [];
    if (clientProfileId) {
      whereOr.push({ clientProfileId });
    }
    if (workerProfileId) {
      whereOr.push({ workerProfileId });
    }

    return prisma.collaborationWorkspace.findMany({
      where: { OR: whereOr },
      include: {
        clientProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        workerProfile: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        request: true,
        planningBoard: true,
        contract: true,
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateWorkspaceStatus(id, status) {
    return prisma.collaborationWorkspace.update({
      where: { id },
      data: { status },
    });
  }

  async updateWorkspaceLinks(id, links) {
    return prisma.collaborationWorkspace.update({
      where: { id },
      data: links,
      include: {
        project: true,
        contract: true,
        conversation: true,
        escrowWallet: true,
      },
    });
  }

  async getOrCreatePlanningBoard(workspaceId, initialData = {}) {
    let board = await prisma.planningBoard.findUnique({
      where: { workspaceId },
    });

    if (!board) {
      board = await prisma.planningBoard.create({
        data: {
          workspaceId,
          scope: initialData.scope || '',
          deliverables: initialData.deliverables ? JSON.stringify(initialData.deliverables) : '[]',
          milestones: initialData.milestones ? JSON.stringify(initialData.milestones) : '[]',
          timeline: initialData.timeline || '',
          budget: initialData.budget ? parseFloat(initialData.budget) : 0,
          revisionPolicy: initialData.revisionPolicy || 'Standard 2 revisions per milestone',
          dueDates: initialData.dueDates || '',
          notes: initialData.notes || '',
        },
      });
    }

    return board;
  }

  async updatePlanningBoard(workspaceId, data) {
    return prisma.planningBoard.update({
      where: { workspaceId },
      data: {
        ...(data.scope !== undefined && { scope: data.scope }),
        ...(data.deliverables !== undefined && { deliverables: typeof data.deliverables === 'string' ? data.deliverables : JSON.stringify(data.deliverables) }),
        ...(data.milestones !== undefined && { milestones: typeof data.milestones === 'string' ? data.milestones : JSON.stringify(data.milestones) }),
        ...(data.timeline !== undefined && { timeline: data.timeline }),
        ...(data.budget !== undefined && { budget: parseFloat(data.budget) }),
        ...(data.revisionPolicy !== undefined && { revisionPolicy: data.revisionPolicy }),
        ...(data.dueDates !== undefined && { dueDates: data.dueDates }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.clientAgreed !== undefined && { clientAgreed: data.clientAgreed }),
        ...(data.workerAgreed !== undefined && { workerAgreed: data.workerAgreed }),
        ...(data.agreedAt !== undefined && { agreedAt: data.agreedAt }),
      },
    });
  }

  async createCompletionCertificate(data) {
    const count = await prisma.completionCertificate.count();
    const certificateNumber = `CERT-2026-${String(count + 1).padStart(6, '0')}`;

    return prisma.completionCertificate.create({
      data: {
        certificateNumber,
        workspaceId: data.workspaceId,
        projectId: data.projectId || null,
        contractId: data.contractId || null,
        clientProfileId: data.clientProfileId,
        workerProfileId: data.workerProfileId,
        projectTitle: data.projectTitle,
        clientName: data.clientName,
        workerName: data.workerName,
        budget: parseFloat(data.budget),
        verificationHash: data.verificationHash,
        pdfUrl: data.pdfUrl || null,
      },
    });
  }

  async getCertificateByWorkspaceId(workspaceId) {
    return prisma.completionCertificate.findFirst({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new CollaborationRepository();
