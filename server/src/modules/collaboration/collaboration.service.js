const crypto = require('crypto');
const collaborationRepository = require('./collaboration.repository');
const { prisma } = require('../../config/database');
const notificationService = require('../notification/notification.service');
const escrowRepository = require('../escrow/escrow.repository');

class CollaborationService {
  async getProfilesForUser(userId) {
    const [clientProfile, workerProfile] = await Promise.all([
      prisma.clientProfile.findUnique({ where: { userId } }),
      prisma.workerProfile.findUnique({ where: { userId } }),
    ]);

    return { clientProfile, workerProfile };
  }

  async requestCollaboration(userId, payload) {
    const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!clientProfile) {
      const err = new Error('Only clients can request collaboration. Please complete your client profile.');
      err.statusCode = 400;
      throw err;
    }

    let workerProfile = await prisma.workerProfile.findUnique({
      where: { id: payload.workerProfileId },
      include: { user: true },
    });

    if (!workerProfile) {
      // Allow passing worker userId as slugOrId
      workerProfile = await prisma.workerProfile.findFirst({
        where: { OR: [{ userId: payload.workerProfileId }, { slug: payload.workerProfileId }] },
        include: { user: true },
      });
    }

    if (!workerProfile) {
      const err = new Error('Worker profile not found');
      err.statusCode = 404;
      throw err;
    }

    const request = await collaborationRepository.createRequest({
      clientProfileId: clientProfile.id,
      workerProfileId: workerProfile.id,
      projectTitle: payload.projectTitle,
      projectDescription: payload.projectDescription,
      budget: payload.budget,
      estimatedDuration: payload.estimatedDuration,
      expectedStartDate: payload.expectedStartDate,
      deadline: payload.deadline,
      additionalNotes: payload.additionalNotes,
    });

    // Notify worker
    await notificationService.sendNotification({
      userId: workerProfile.userId,
      title: 'New Collaboration Request',
      message: `Client has requested collaboration on "${payload.projectTitle}" for ₹${payload.budget}.`,
      type: 'PROJECT',
      linkUrl: '/collaboration',
      entityId: request.id,
      entityType: 'COLLABORATION_REQUEST',
    }).catch(() => {});

    return request;
  }

  async getRequests(userId) {
    const { clientProfile, workerProfile } = await this.getProfilesForUser(userId);
    const clientProfileId = clientProfile ? clientProfile.id : null;
    const workerProfileId = workerProfile ? workerProfile.id : null;

    if (!clientProfileId && !workerProfileId) {
      return [];
    }

    return collaborationRepository.listRequestsForUser(clientProfileId, workerProfileId);
  }

  async getRequestById(userId, requestId) {
    const request = await collaborationRepository.getRequestById(requestId);
    if (!request) {
      const err = new Error('Collaboration request not found');
      err.statusCode = 404;
      throw err;
    }

    const { clientProfile, workerProfile } = await this.getProfilesForUser(userId);
    const isClient = clientProfile && clientProfile.id === request.clientProfileId;
    const isWorker = workerProfile && workerProfile.id === request.workerProfileId;

    if (!isClient && !isWorker) {
      const err = new Error('Unauthorized to view this collaboration request');
      err.statusCode = 403;
      throw err;
    }

    return request;
  }

  async respondToRequest(userId, requestId, { action, rejectionReason }) {
    const request = await collaborationRepository.getRequestById(requestId);
    if (!request) {
      const err = new Error('Collaboration request not found');
      err.statusCode = 404;
      throw err;
    }

    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId } });
    if (!workerProfile || workerProfile.id !== request.workerProfileId) {
      const err = new Error('Only the assigned worker can accept or reject this request');
      err.statusCode = 403;
      throw err;
    }

    if (action === 'REJECT') {
      const updated = await collaborationRepository.updateRequestStatus(requestId, 'REJECTED', rejectionReason);
      await notificationService.sendNotification({
        userId: request.clientProfile.userId,
        title: 'Collaboration Request Declined',
        message: `Worker declined your collaboration request for "${request.projectTitle}".`,
        type: 'PROJECT',
        entityId: request.id,
      }).catch(() => {});
      return updated;
    }

    if (action === 'ACCEPT') {
      await collaborationRepository.updateRequestStatus(requestId, 'ACCEPTED');

      // Create private conversation for Chat Room
      const countConv = await prisma.conversation.count();
      const conversationNumber = `CONV-2026-${String(countConv + 1).padStart(6, '0')}`;
      const conversation = await prisma.conversation.create({
        data: {
          conversationNumber,
          type: 'DIRECT',
          title: `Chat: ${request.projectTitle}`,
          createdById: userId,
          participants: {
            create: [
              { userId: request.clientProfile.userId, role: 'OWNER' },
              { userId: request.workerProfile.userId, role: 'MEMBER' },
            ],
          },
        },
      });

      // Get or create Escrow Wallet for Client
      const escrowWallet = await escrowRepository.getOrCreateWallet(request.clientProfileId);

      // Create Private Collaboration Workspace
      const workspace = await collaborationRepository.createWorkspace({
        requestId: request.id,
        clientProfileId: request.clientProfileId,
        workerProfileId: request.workerProfileId,
        conversationId: conversation.id,
        escrowWalletId: escrowWallet.id,
      });

      // Initialize Planning Board
      await collaborationRepository.getOrCreatePlanningBoard(workspace.id, {
        scope: request.projectDescription,
        budget: request.budget,
        timeline: request.estimatedDuration,
        dueDates: request.deadline ? request.deadline.toISOString().split('T')[0] : '',
        milestones: [
          { id: 'm1', title: 'Phase 1: Initial Deliverables', description: 'Setup and design deliverables', amount: request.budget * 0.5, order: 1 },
          { id: 'm2', title: 'Phase 2: Final Delivery & Handoff', description: 'Complete implementation & review', amount: request.budget * 0.5, order: 2 },
        ],
        deliverables: [
          { id: 'd1', title: 'Project Specification Document', status: 'PENDING' },
          { id: 'd2', title: 'Final Code repository and documentation', status: 'PENDING' },
        ],
      });

      // Notify Client
      await notificationService.sendNotification({
        userId: request.clientProfile.userId,
        title: 'Collaboration Request Accepted!',
        message: `Worker accepted your collaboration request for "${request.projectTitle}". Private workspace is ready.`,
        type: 'PROJECT',
        linkUrl: `/collaboration/workspace/${workspace.id}`,
        entityId: workspace.id,
      }).catch(() => {});

      return collaborationRepository.getWorkspaceById(workspace.id);
    }

    const err = new Error('Invalid action. Must be ACCEPT or REJECT.');
    err.statusCode = 400;
    throw err;
  }

  async getWorkspaces(userId) {
    const { clientProfile, workerProfile } = await this.getProfilesForUser(userId);
    const clientProfileId = clientProfile ? clientProfile.id : null;
    const workerProfileId = workerProfile ? workerProfile.id : null;

    if (!clientProfileId && !workerProfileId) {
      return [];
    }

    return collaborationRepository.listWorkspacesForUser(clientProfileId, workerProfileId);
  }

  async getWorkspaceById(userId, workspaceId) {
    const workspace = await collaborationRepository.getWorkspaceById(workspaceId);
    if (!workspace) {
      const err = new Error('Collaboration workspace not found');
      err.statusCode = 404;
      throw err;
    }

    const isClient = workspace.clientProfile.userId === userId;
    const isWorker = workspace.workerProfile.userId === userId;

    if (!isClient && !isWorker) {
      const err = new Error('Access denied: You are not a member of this workspace');
      err.statusCode = 403;
      throw err;
    }

    // Ensure planning board exists
    if (!workspace.planningBoard) {
      await collaborationRepository.getOrCreatePlanningBoard(workspace.id, {
        scope: workspace.request ? workspace.request.projectDescription : '',
        budget: workspace.request ? workspace.request.budget : 0,
      });
      return collaborationRepository.getWorkspaceById(workspaceId);
    }

    return workspace;
  }

  async updatePlanningBoard(userId, workspaceId, data) {
    const workspace = await this.getWorkspaceById(userId, workspaceId);

    const isClient = workspace.clientProfile.userId === userId;
    const isWorker = workspace.workerProfile.userId === userId;

    let clientAgreed = workspace.planningBoard ? workspace.planningBoard.clientAgreed : false;
    let workerAgreed = workspace.planningBoard ? workspace.planningBoard.workerAgreed : false;

    if (data.agree === true) {
      if (isClient) {
        clientAgreed = true;
      }
      if (isWorker) {
        workerAgreed = true;
      }
    } else if (data.agree === false) {
      if (isClient) {
        clientAgreed = false;
      }
      if (isWorker) {
        workerAgreed = false;
      }
    }

    const bothAgreed = clientAgreed && workerAgreed;
    const updatePayload = {
      ...data,
      clientAgreed,
      workerAgreed,
      ...(bothAgreed && { agreedAt: new Date() }),
    };

    const updatedBoard = await collaborationRepository.updatePlanningBoard(workspaceId, updatePayload);

    // If both users agreed, generate Enterprise Digital Contract if not already generated
    if (bothAgreed && !workspace.contract) {
      const title = workspace.request ? workspace.request.projectTitle : 'Enterprise Project Contract';

      const countContract = await prisma.contract.count();
      const contractNumber = `TP-2026-${String(countContract + 1).padStart(6, '0')}`;

      const contract = await prisma.contract.create({
        data: {
          contractNumber,
          clientProfileId: workspace.clientProfileId,
          workerProfileId: workspace.workerProfileId,
          escrowWalletId: workspace.escrowWalletId,
          title,
          description: `Contract generated from workspace ${workspace.workspaceNumber}`,
          scopeOfWork: updatedBoard.scope || 'Standard project scope',
          deliverables: updatedBoard.deliverables || '[]',
          termsAndConditions: `1. Payment Terms: Escrow release upon client final approval.\n2. Revisions: ${updatedBoard.revisionPolicy || 'Standard 2 revisions'}.\n3. Confidentiality: Private client/worker agreement.\n4. Dispute Resolution: TrustPay Enterprise Escrow protection.`,
          paymentTermsText: `Escrow amount of ₹${updatedBoard.budget || workspace.request?.budget || 0} to be funded prior to execution.`,
          status: 'DRAFT',
          signatures: {
            create: [
              { signerUserId: workspace.clientProfile.userId, signerRole: 'CLIENT', signatureStatus: 'PENDING' },
              { signerUserId: workspace.workerProfile.userId, signerRole: 'WORKER', signatureStatus: 'PENDING' },
            ],
          },
        },
      });

      await collaborationRepository.updateWorkspaceLinks(workspace.id, { contractId: contract.id });
      await collaborationRepository.updateWorkspaceStatus(workspace.id, 'CONTRACT_PENDING');

      // Send notifications to both Client and Worker
      const contractLink = `/collaboration/workspace/${workspace.id}`;
      await notificationService.sendNotification({
        userId: workspace.clientProfile.userId,
        title: 'Digital Contract Ready for Review',
        message: 'Both parties agreed to the planning board. Please review and sign the Enterprise Digital Contract.',
        type: 'CONTRACT',
        linkUrl: contractLink,
        entityId: contract.id,
      }).catch(() => {});

      await notificationService.sendNotification({
        userId: workspace.workerProfile.userId,
        title: 'Digital Contract Ready for Review',
        message: 'Both parties agreed to the planning board. Please review and sign the Enterprise Digital Contract.',
        type: 'CONTRACT',
        linkUrl: contractLink,
        entityId: contract.id,
      }).catch(() => {});
    }

    return collaborationRepository.getWorkspaceById(workspaceId);
  }

  async signContract(userId, workspaceId, { _signatureType = 'DRAW', signatureData }) {
    const workspace = await this.getWorkspaceById(userId, workspaceId);

    if (!workspace.contract) {
      const err = new Error('No digital contract found for this workspace');
      err.statusCode = 404;
      throw err;
    }

    if (workspace.contract.status === 'ACCEPTED' || workspace.status === 'CONTRACT_LOCKED') {
      const err = new Error('Contract is already LOCKED and signed by both parties.');
      err.statusCode = 400;
      throw err;
    }

    const role = workspace.clientProfile.userId === userId ? 'CLIENT' : 'WORKER';
    const sigHash = crypto.createHash('sha256').update(`${userId}-${Date.now()}-${signatureData}`).digest('hex');

    await prisma.contractSignature.upsert({
      where: {
        contractId_signerUserId: {
          contractId: workspace.contract.id,
          signerUserId: userId,
        },
      },
      update: {
        signatureStatus: 'SIGNED',
        signatureTimestamp: new Date(),
        signatureHash: sigHash,
      },
      create: {
        contractId: workspace.contract.id,
        signerUserId: userId,
        signerRole: role,
        signatureStatus: 'SIGNED',
        signatureTimestamp: new Date(),
        signatureHash: sigHash,
      },
    });

    // Check if both signatures are complete
    const signatures = await prisma.contractSignature.findMany({
      where: { contractId: workspace.contract.id },
    });

    const allSigned = signatures.length >= 2 && signatures.every((s) => s.signatureStatus === 'SIGNED');

    if (allSigned) {
      // Lock contract
      await prisma.contract.update({
        where: { id: workspace.contract.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
          signatureHash: sigHash,
        },
      });

      await collaborationRepository.updateWorkspaceStatus(workspace.id, 'CONTRACT_LOCKED');

      // Create linked Project in execution system
      if (!workspace.projectId) {
        const countProj = await prisma.project.count();
        const projectNumber = `PRJ-2026-${String(countProj + 1).padStart(6, '0')}`;
        const title = workspace.request ? workspace.request.projectTitle : 'Collaboration Project';

        let parsedMilestones = [];
        try {
          parsedMilestones = JSON.parse(workspace.planningBoard.milestones || '[]');
        } catch {
          parsedMilestones = [];
        }

        const project = await prisma.project.create({
          data: {
            projectNumber,
            title,
            description: workspace.planningBoard.scope,
            clientProfileId: workspace.clientProfileId,
            workerProfileId: workspace.workerProfileId,
            contractId: workspace.contract.id,
            escrowWalletId: workspace.escrowWalletId,
            createdById: workspace.clientProfile.userId,
            status: 'ACTIVE',
            estimatedBudget: workspace.planningBoard.budget || workspace.request?.budget || 0,
            members: {
              create: [
                { userId: workspace.clientProfile.userId, role: 'OWNER' },
                { userId: workspace.workerProfile.userId, role: 'WORKER' },
              ],
            },
            milestones: {
              create: parsedMilestones.map((m, idx) => ({
                title: m.title || `Milestone ${idx + 1}`,
                description: m.description || '',
                estimatedAmount: m.amount ? parseFloat(m.amount) : 0,
                order: idx + 1,
                status: 'PENDING',
              })),
            },
          },
        });

        await collaborationRepository.updateWorkspaceLinks(workspace.id, { projectId: project.id });
      }

      // Send completion notifications to both Client and Worker
      const lockLink = `/collaboration/workspace/${workspace.id}`;
      await notificationService.sendNotification({
        userId: workspace.clientProfile.userId,
        title: 'CONTRACT LOCKED',
        message: 'Both parties signed the contract. Contract is now LOCKED. Escrow funding enabled.',
        type: 'CONTRACT',
        linkUrl: lockLink,
        entityId: workspace.contract.id,
      }).catch(() => {});

      await notificationService.sendNotification({
        userId: workspace.workerProfile.userId,
        title: 'CONTRACT LOCKED',
        message: 'Both parties signed the contract. Contract is now LOCKED. Awaiting client escrow deposit.',
        type: 'CONTRACT',
        linkUrl: lockLink,
        entityId: workspace.contract.id,
      }).catch(() => {});
    }

    return collaborationRepository.getWorkspaceById(workspaceId);
  }

  async fundEscrow(userId, workspaceId, { amount }) {
    const workspace = await this.getWorkspaceById(userId, workspaceId);

    if (workspace.clientProfile.userId !== userId) {
      const err = new Error('Only the client can fund escrow for this workspace.');
      err.statusCode = 403;
      throw err;
    }

    const fundAmount = parseFloat(amount || workspace.planningBoard?.budget || workspace.request?.budget || 0);

    const wallet = await escrowRepository.getOrCreateWallet(workspace.clientProfileId);

    // Update wallet balance for demo/production workflow
    const currentAvail = wallet.availableBalance;
    const currentHeld = wallet.heldBalance;

    // Allocate funds into escrow
    await prisma.escrowWallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: currentAvail,
        heldBalance: currentHeld + fundAmount,
        totalBalance: wallet.totalBalance < fundAmount ? fundAmount : wallet.totalBalance,
      },
    });

    // Record Wallet Transaction
    const refNum = `TX-ESC-HOLD-${Date.now()}`;
    await prisma.walletTransaction.create({
      data: {
        escrowWalletId: wallet.id,
        contractId: workspace.contractId,
        type: 'HOLD',
        amount: fundAmount,
        currency: 'INR',
        balanceBefore: currentAvail,
        balanceAfter: currentAvail,
        referenceNumber: refNum,
        description: `Escrow funding locked for workspace ${workspace.workspaceNumber}`,
        actorUserId: userId,
      },
    });

    // Update contract escrowState
    if (workspace.contractId) {
      await prisma.contract.update({
        where: { id: workspace.contractId },
        data: { escrowState: 'FUNDED' },
      });
    }

    await collaborationRepository.updateWorkspaceStatus(workspace.id, 'FUNDED');

    // Notify Worker
    await notificationService.sendNotification({
      userId: workspace.workerProfile.userId,
      title: 'Escrow Funded!',
      message: `Client deposited ₹${fundAmount} into Escrow. You may now begin project execution.`,
      type: 'ESCROW',
      entityId: workspace.id,
    }).catch(() => {});

    return collaborationRepository.getWorkspaceById(workspaceId);
  }

  async updateExecutionProgress(userId, workspaceId, payload) {
    const workspace = await this.getWorkspaceById(userId, workspaceId);

    if (workspace.workerProfile.userId !== userId) {
      const err = new Error('Only the assigned worker can submit milestone execution updates.');
      err.statusCode = 403;
      throw err;
    }

    if (workspace.status !== 'FUNDED' && workspace.status !== 'IN_PROGRESS') {
      await collaborationRepository.updateWorkspaceStatus(workspace.id, 'IN_PROGRESS');
    }

    if (payload.milestoneId && workspace.projectId) {
      await prisma.projectMilestone.update({
        where: { id: payload.milestoneId },
        data: {
          status: payload.status || 'IN_REVIEW',
          completionPercentage: payload.status === 'COMPLETED' ? 100 : 50,
          completedAt: payload.status === 'COMPLETED' ? new Date() : null,
        },
      });
    }

    // Notify Client
    await notificationService.sendNotification({
      userId: workspace.clientProfile.userId,
      title: 'Milestone Submission / Deliverable Update',
      message: `Worker uploaded progress updates for "${workspace.request?.projectTitle || 'Project'}". Please review.`,
      type: 'PROJECT',
      entityId: workspace.id,
    }).catch(() => {});

    return collaborationRepository.getWorkspaceById(workspaceId);
  }

  async approveFinalDelivery(userId, workspaceId) {
    const workspace = await this.getWorkspaceById(userId, workspaceId);

    if (workspace.clientProfile.userId !== userId) {
      const err = new Error('Only the client can approve final delivery and release escrow.');
      err.statusCode = 403;
      throw err;
    }

    const releaseAmount = workspace.planningBoard?.budget || workspace.request?.budget || 0;

    // Release Escrow funds
    const wallet = await escrowRepository.getOrCreateWallet(workspace.clientProfileId);

    await prisma.escrowWallet.update({
      where: { id: wallet.id },
      data: {
        heldBalance: Math.max(0, wallet.heldBalance - releaseAmount),
        releasedBalance: wallet.releasedBalance + releaseAmount,
      },
    });

    // Create EscrowRelease record
    const release = await prisma.escrowRelease.create({
      data: {
        escrowWalletId: wallet.id,
        contractId: workspace.contractId || workspace.contract?.id || workspace.id,
        workerProfileId: workspace.workerProfileId,
        amount: releaseAmount,
        currency: 'INR',
        releaseType: 'FULL',
        notes: `Final approval for workspace ${workspace.workspaceNumber}`,
        releasedByUserId: userId,
      },
    });

    // Wallet Transaction
    await prisma.walletTransaction.create({
      data: {
        escrowWalletId: wallet.id,
        contractId: workspace.contractId,
        type: 'RELEASE',
        amount: releaseAmount,
        currency: 'INR',
        balanceBefore: wallet.availableBalance,
        balanceAfter: wallet.availableBalance,
        referenceNumber: `TX-REL-${Date.now()}`,
        description: `Escrow released to worker for workspace ${workspace.workspaceNumber}`,
        actorUserId: userId,
      },
    });

    // Update statuses
    if (workspace.contractId) {
      await prisma.contract.update({
        where: { id: workspace.contractId },
        data: { escrowState: 'RELEASED', status: 'ACCEPTED' },
      });
    }

    if (workspace.projectId) {
      await prisma.project.update({
        where: { id: workspace.projectId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    }

    await collaborationRepository.updateWorkspaceStatus(workspace.id, 'COMPLETED');

    // Generate Invoice & Receipt
    const countInv = await prisma.invoice.count();
    const invoiceNumber = `INV-2026-${String(countInv + 1).padStart(6, '0')}`;
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        contractId: workspace.contractId,
        escrowWalletId: wallet.id,
        clientProfileId: workspace.clientProfileId,
        workerProfileId: workspace.workerProfileId,
        amount: releaseAmount,
        totalAmount: releaseAmount,
        currency: 'INR',
        paymentDetailsText: `Paid & Released via TrustPay Escrow for ${workspace.request?.projectTitle || 'Project'}`,
      },
    });

    // Generate Completion Certificate
    const clientName = `${workspace.clientProfile.user.firstName} ${workspace.clientProfile.user.lastName}`;
    const workerName = `${workspace.workerProfile.user.firstName} ${workspace.workerProfile.user.lastName}`;
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${workspace.id}-${release.id}-${Date.now()}`)
      .digest('hex');

    const certificate = await collaborationRepository.createCompletionCertificate({
      workspaceId: workspace.id,
      projectId: workspace.projectId,
      contractId: workspace.contractId,
      clientProfileId: workspace.clientProfileId,
      workerProfileId: workspace.workerProfileId,
      projectTitle: workspace.request?.projectTitle || workspace.project?.title || 'Enterprise Project',
      clientName,
      workerName,
      budget: releaseAmount,
      verificationHash,
    });

    // Send notifications to both
    await notificationService.sendNotification({
      userId: workspace.workerProfile.userId,
      title: 'Project Completed & Escrow Released!',
      message: `Client approved final delivery! ₹${releaseAmount} has been released to your wallet. Completion certificate generated.`,
      type: 'ESCROW',
      entityId: certificate.id,
    }).catch(() => {});

    await notificationService.sendNotification({
      userId: workspace.clientProfile.userId,
      title: 'Project Successfully Completed',
      message: `You approved final delivery. Escrow funds released, invoice ${invoice.invoiceNumber} and Completion Certificate generated.`,
      type: 'PROJECT',
      entityId: certificate.id,
    }).catch(() => {});

    return {
      workspace: await collaborationRepository.getWorkspaceById(workspaceId),
      invoice,
      certificate,
      release,
    };
  }
}

module.exports = new CollaborationService();
