'use strict';

const crypto = require('crypto');
const projectRepository = require('./project.repository');
const prisma = require('../../config/database');
const { generateProjectNumber } = require('./projectNumberGenerator');
const { isValidProjectTransition, getStatusTimestampUpdates } = require('./projectStateMachine');
const { isValidDeliverableTransition } = require('./deliverableWorkflow');
const { calculateProjectProgress } = require('./projectProgressEngine');
const { calculateMilestoneEscrowReadiness } = require('./escrowReadinessCalculator');
const {
  ValidationError,
  AuthorizationError,
  NotFoundError,
} = require('../../utils/ApiError');

class ProjectService {
  /**
   * Helper to ensure user has access to view/modify project
   */
  async _verifyProjectAccess(projectId, userId, role) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project');
    }

    if (role === 'ADMIN') {
      return project;
    }

    const isClientOwner = project.clientProfile?.userId === userId || project.createdById === userId;
    const isWorkerAssigned = project.workerProfile?.userId === userId;
    const isMember = project.members?.some((m) => m.userId === userId);

    if (!isClientOwner && !isWorkerAssigned && !isMember) {
      throw new AuthorizationError('You do not have access to this project');
    }

    return project;
  }

  /**
   * Create a new Project
   */
  async createProject(userId, userRole, data, auditMeta = {}) {
    let clientProfileId = null;

    if (userRole === 'CLIENT') {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId },
      });
      if (!clientProfile) {
        throw new ValidationError('Client profile required to create projects');
      }
      clientProfileId = clientProfile.id;
    } else if (userRole === 'ADMIN') {
      if (!data.clientProfileId) {
        throw new ValidationError('clientProfileId is required when created by admin');
      }
      clientProfileId = data.clientProfileId;
    } else {
      throw new AuthorizationError('Only clients or admins can create projects');
    }

    const projectNumber = await generateProjectNumber();

    if (data.contractId) {
      const contract = await prisma.contract.findUnique({ where: { id: data.contractId } });
      if (!contract) {
        throw new NotFoundError('Linked Contract');
      }
    }

    if (data.escrowWalletId) {
      const wallet = await prisma.escrowWallet.findUnique({ where: { id: data.escrowWalletId } });
      if (!wallet) {
        throw new NotFoundError('Linked Escrow Wallet');
      }
    }

    if (data.workerProfileId) {
      const worker = await prisma.workerProfile.findUnique({ where: { id: data.workerProfileId } });
      if (!worker) {
        throw new NotFoundError('Assigned Worker Profile');
      }
    }

    const projectData = {
      projectNumber,
      title: data.title,
      description: data.description || null,
      category: data.category || null,
      clientProfileId,
      workerProfileId: data.workerProfileId || null,
      contractId: data.contractId || null,
      escrowWalletId: data.escrowWalletId || null,
      priority: data.priority || 'MEDIUM',
      status: 'DRAFT',
      estimatedBudget: data.estimatedBudget !== undefined ? data.estimatedBudget : null,
      estimatedDuration: data.estimatedDuration || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      targetEndDate: data.targetEndDate ? new Date(data.targetEndDate) : null,
      notes: data.notes || null,
      createdById: userId,
    };

    const project = await projectRepository.create(projectData);

    await projectRepository.addMember(project.id, userId, 'OWNER');

    if (data.workerProfileId) {
      const worker = await prisma.workerProfile.findUnique({ where: { id: data.workerProfileId } });
      if (worker) {
        await projectRepository.addMember(project.id, worker.userId, 'WORKER');
      }
    }

    await Promise.all([
      projectRepository.createTimelineEvent({
        projectId: project.id,
        eventType: 'CREATED',
        title: 'Project Created',
        description: `Project ${projectNumber} created as DRAFT`,
        performedByUserId: userId,
      }),
      projectRepository.createStatusHistory({
        projectId: project.id,
        previousStatus: null,
        newStatus: 'DRAFT',
        changedByUserId: userId,
        reason: 'Initial creation',
      }),
      projectRepository.createAuditActivity({
        projectId: project.id,
        actorUserId: userId,
        requestId: auditMeta.requestId,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        action: 'PROJECT_CREATED',
        details: JSON.stringify({ projectNumber, title: project.title }),
      }),
    ]);

    return this.getProjectById(project.id, userId, userRole);
  }

  /**
   * Get Project by ID with dynamic progress & escrow readiness
   */
  async getProjectById(id, userId, role) {
    const project = await this._verifyProjectAccess(id, userId, role);

    const progressMetrics = calculateProjectProgress(project.milestones, project.deliverables);

    const milestonesWithReadiness = project.milestones.map((m) => {
      const readiness = calculateMilestoneEscrowReadiness(m);
      return {
        ...m,
        escrowReadiness: readiness,
      };
    });

    return {
      ...project,
      milestones: milestonesWithReadiness,
      progressMetrics,
    };
  }

  /**
   * Search / List Projects
   */
  async searchProjects(userId, role, query = {}) {
    const {
      q,
      status,
      priority,
      workerProfileId,
      clientProfileId,
      startDate,
      endDate,
      sortBy = 'newest',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where = {};

    if (role === 'CLIENT') {
      const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
      if (clientProfile) {
        where.clientProfileId = clientProfile.id;
      } else {
        where.createdById = userId;
      }
    } else if (role === 'WORKER') {
      const workerProfile = await prisma.workerProfile.findUnique({ where: { userId } });
      if (workerProfile) {
        where.OR = [
          { workerProfileId: workerProfile.id },
          { members: { some: { userId } } },
        ];
      } else {
        where.members = { some: { userId } };
      }
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { projectNumber: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (workerProfileId) {
      where.workerProfileId = workerProfileId;
    }
    if (clientProfileId) {
      where.clientProfileId = clientProfileId;
    }

    if (startDate) {
      where.createdAt = { ...(where.createdAt || {}), gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { ...(where.createdAt || {}), lte: new Date(endDate) };
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortBy === 'title') {
      orderBy = { title: sortOrder };
    } else if (sortBy === 'status') {
      orderBy = { status: sortOrder };
    } else if (sortBy === 'budget') {
      orderBy = { estimatedBudget: sortOrder };
    }

    const result = await projectRepository.findMany({ where, orderBy, page, limit });

    const enrichedProjects = result.projects.map((p) => {
      const progress = calculateProjectProgress(p.milestones, p.deliverables);
      return {
        ...p,
        progressMetrics: progress,
      };
    });

    return {
      ...result,
      projects: enrichedProjects,
    };
  }

  /**
   * Update Project Details
   */
  async updateProject(id, userId, role, data, auditMeta = {}) {
    const project = await this._verifyProjectAccess(id, userId, role);

    const updateData = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.category !== undefined) {
      updateData.category = data.category;
    }
    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }
    if (data.estimatedBudget !== undefined) {
      updateData.estimatedBudget = data.estimatedBudget;
    }
    if (data.estimatedDuration !== undefined) {
      updateData.estimatedDuration = data.estimatedDuration;
    }
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.targetEndDate !== undefined) {
      updateData.targetEndDate = data.targetEndDate ? new Date(data.targetEndDate) : null;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    if (data.workerProfileId !== undefined && data.workerProfileId !== project.workerProfileId) {
      updateData.workerProfileId = data.workerProfileId;
      if (data.workerProfileId) {
        const worker = await prisma.workerProfile.findUnique({ where: { id: data.workerProfileId } });
        if (worker) {
          await projectRepository.addMember(id, worker.userId, 'WORKER');
        }
      }
    }

    if (data.contractId !== undefined) {
      updateData.contractId = data.contractId;
    }
    if (data.escrowWalletId !== undefined) {
      updateData.escrowWalletId = data.escrowWalletId;
    }

    await projectRepository.update(id, updateData);

    await projectRepository.createAuditActivity({
      projectId: id,
      actorUserId: userId,
      requestId: auditMeta.requestId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      action: 'PROJECT_UPDATED',
      details: JSON.stringify(updateData),
    });

    return this.getProjectById(id, userId, role);
  }

  /**
   * Update Project Status using Centralized State Machine
   */
  async updateProjectStatus(id, userId, role, newStatus, reason = '', auditMeta = {}) {
    const project = await this._verifyProjectAccess(id, userId, role);
    const previousStatus = project.status;

    if (!isValidProjectTransition(previousStatus, newStatus)) {
      throw new ValidationError(`Invalid project status transition from ${previousStatus} to ${newStatus}`);
    }

    const timestampUpdates = getStatusTimestampUpdates(newStatus);
    await projectRepository.update(id, timestampUpdates);

    await Promise.all([
      projectRepository.createStatusHistory({
        projectId: id,
        previousStatus,
        newStatus,
        changedByUserId: userId,
        reason: reason || `Status changed from ${previousStatus} to ${newStatus}`,
      }),
      projectRepository.createTimelineEvent({
        projectId: id,
        eventType: newStatus,
        title: `Project Status Changed to ${newStatus}`,
        description: reason || `Status transitioned from ${previousStatus} to ${newStatus}`,
        performedByUserId: userId,
      }),
      projectRepository.createAuditActivity({
        projectId: id,
        actorUserId: userId,
        requestId: auditMeta.requestId,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        action: 'STATUS_CHANGED',
        details: JSON.stringify({ previousStatus, newStatus, reason }),
      }),
    ]);

    return this.getProjectById(id, userId, role);
  }

  /**
   * Add Milestone to Project
   */
  async addMilestone(projectId, userId, role, data, auditMeta = {}) {
    await this._verifyProjectAccess(projectId, userId, role);

    if (data.prerequisiteMilestoneId) {
      const prereq = await projectRepository.findMilestoneById(data.prerequisiteMilestoneId);
      if (!prereq || prereq.projectId !== projectId) {
        throw new ValidationError('Prerequisite milestone must belong to the same project');
      }
    }

    const milestone = await projectRepository.createMilestone({
      projectId,
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: 'PENDING',
      estimatedAmount: data.estimatedAmount !== undefined ? data.estimatedAmount : null,
      prerequisiteMilestoneId: data.prerequisiteMilestoneId || null,
      order: data.order || 1,
    });

    await Promise.all([
      projectRepository.createTimelineEvent({
        projectId,
        eventType: 'MILESTONE_CREATED',
        title: `Milestone Created: ${milestone.title}`,
        description: data.description || `Milestone created with estimated amount ₹${data.estimatedAmount || 0}`,
        performedByUserId: userId,
      }),
      projectRepository.createAuditActivity({
        projectId,
        actorUserId: userId,
        requestId: auditMeta.requestId,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        action: 'MILESTONE_CREATED',
        details: JSON.stringify({ milestoneId: milestone.id, title: milestone.title }),
      }),
    ]);

    return milestone;
  }

  /**
   * Update Milestone (with Dependency Check)
   */
  async updateMilestone(projectId, milestoneId, userId, role, data, auditMeta = {}) {
    await this._verifyProjectAccess(projectId, userId, role);

    const milestone = await projectRepository.findMilestoneById(milestoneId);
    if (!milestone || milestone.projectId !== projectId) {
      throw new NotFoundError('Milestone');
    }

    if (data.status === 'COMPLETED' && milestone.prerequisiteMilestoneId) {
      const prereq = await projectRepository.findMilestoneById(milestone.prerequisiteMilestoneId);
      if (prereq && prereq.status !== 'COMPLETED') {
        throw new ValidationError(
          `Cannot complete milestone "${milestone.title}". Prerequisite milestone "${prereq.title}" is not yet COMPLETED.`
        );
      }
    }

    const updateData = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.estimatedAmount !== undefined) {
      updateData.estimatedAmount = data.estimatedAmount;
    }
    if (data.prerequisiteMilestoneId !== undefined) {
      updateData.prerequisiteMilestoneId = data.prerequisiteMilestoneId;
    }
    if (data.completionPercentage !== undefined) {
      updateData.completionPercentage = data.completionPercentage;
    }
    if (data.order !== undefined) {
      updateData.order = data.order;
    }

    if (data.status !== undefined && data.status !== milestone.status) {
      updateData.status = data.status;
      if (data.status === 'COMPLETED') {
        updateData.completedAt = new Date();
        updateData.completionPercentage = 100;
      }
    }

    const updated = await projectRepository.updateMilestone(milestoneId, updateData);

    await projectRepository.createAuditActivity({
      projectId,
      actorUserId: userId,
      requestId: auditMeta.requestId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      action: 'MILESTONE_UPDATED',
      details: JSON.stringify({ milestoneId, updateData }),
    });

    return updated;
  }

  /**
   * Delete Milestone
   */
  async deleteMilestone(projectId, milestoneId, userId, role, auditMeta = {}) {
    await this._verifyProjectAccess(projectId, userId, role);

    const milestone = await projectRepository.findMilestoneById(milestoneId);
    if (!milestone || milestone.projectId !== projectId) {
      throw new NotFoundError('Milestone');
    }

    await projectRepository.deleteMilestone(milestoneId);

    await projectRepository.createAuditActivity({
      projectId,
      actorUserId: userId,
      requestId: auditMeta.requestId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      action: 'MILESTONE_DELETED',
      details: JSON.stringify({ milestoneId, title: milestone.title }),
    });

    return { success: true };
  }

  /**
   * Add Deliverable
   */
  async addDeliverable(projectId, userId, role, data, auditMeta = {}) {
    await this._verifyProjectAccess(projectId, userId, role);

    if (data.milestoneId) {
      const milestone = await projectRepository.findMilestoneById(data.milestoneId);
      if (!milestone || milestone.projectId !== projectId) {
        throw new ValidationError('Milestone must belong to the same project');
      }
    }

    const deliverable = await projectRepository.createDeliverable({
      projectId,
      milestoneId: data.milestoneId || null,
      title: data.title,
      description: data.description || null,
      status: 'DRAFT',
      currentVersion: 1,
      revisionCount: 0,
    });

    await projectRepository.createAuditActivity({
      projectId,
      actorUserId: userId,
      requestId: auditMeta.requestId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      action: 'DELIVERABLE_CREATED',
      details: JSON.stringify({ deliverableId: deliverable.id, title: deliverable.title }),
    });

    return deliverable;
  }

  /**
   * Submit Deliverable (Immutable Versioning Engine)
   */
  async submitDeliverable(projectId, deliverableId, userId, role, data, auditMeta = {}) {
    await this._verifyProjectAccess(projectId, userId, role);

    const deliverable = await projectRepository.findDeliverableById(deliverableId);
    if (!deliverable || deliverable.projectId !== projectId) {
      throw new NotFoundError('Deliverable');
    }

    if (!isValidDeliverableTransition(deliverable.status, 'SUBMITTED')) {
      throw new ValidationError(`Cannot submit deliverable from status ${deliverable.status}`);
    }

    const isRevision = deliverable.status === 'REVISION_REQUESTED' || deliverable.status === 'REJECTED';
    const nextVersionNumber = deliverable.versions.length > 0
      ? Math.max(...deliverable.versions.map((v) => v.versionNumber)) + 1
      : 1;

    const versionRecord = await projectRepository.createDeliverableVersion({
      deliverableId,
      versionNumber: nextVersionNumber,
      description: data.description,
      fileUrls: data.fileUrls || [],
      submittedByUserId: userId,
      status: 'SUBMITTED',
    });

    const updatedDeliverable = await projectRepository.updateDeliverable(deliverableId, {
      status: 'SUBMITTED',
      currentVersion: nextVersionNumber,
      submittedAt: new Date(),
      revisionCount: isRevision ? deliverable.revisionCount + 1 : deliverable.revisionCount,
    });

    await Promise.all([
      projectRepository.createTimelineEvent({
        projectId,
        eventType: 'DELIVERABLE_SUBMITTED',
        title: `Deliverable Submitted (v${nextVersionNumber}): ${deliverable.title}`,
        description: data.description,
        performedByUserId: userId,
      }),
      projectRepository.createAuditActivity({
        projectId,
        actorUserId: userId,
        requestId: auditMeta.requestId,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        action: 'DELIVERABLE_SUBMITTED',
        details: JSON.stringify({ deliverableId, versionNumber: nextVersionNumber }),
      }),
    ]);

    return {
      deliverable: updatedDeliverable,
      version: versionRecord,
    };
  }

  /**
   * Review Deliverable (Approval Workflow Engine)
   */
  async reviewDeliverable(projectId, deliverableId, userId, role, data, auditMeta = {}) {
    const project = await this._verifyProjectAccess(projectId, userId, role);

    const isClientOwner = project.clientProfile?.userId === userId || project.createdById === userId;
    if (!isClientOwner && role !== 'ADMIN') {
      throw new AuthorizationError('Only the project client can review and approve deliverables');
    }

    const deliverable = await projectRepository.findDeliverableById(deliverableId);
    if (!deliverable || deliverable.projectId !== projectId) {
      throw new NotFoundError('Deliverable');
    }

    const targetStatus = data.status;
    if (!isValidDeliverableTransition(deliverable.status, targetStatus)) {
      throw new ValidationError(`Invalid deliverable transition from ${deliverable.status} to ${targetStatus}`);
    }

    const updates = {
      status: targetStatus,
      clientFeedback: data.clientFeedback,
    };

    if (targetStatus === 'APPROVED') {
      updates.approvedAt = new Date();
    }

    const updatedDeliverable = await projectRepository.updateDeliverable(deliverableId, updates);

    if (deliverable.versions && deliverable.versions.length > 0) {
      const latestVersion = deliverable.versions[0];
      await prisma.deliverableVersion.update({
        where: { id: latestVersion.id },
        data: {
          status: targetStatus,
          clientFeedback: data.clientFeedback,
        },
      });
    }

    await Promise.all([
      projectRepository.createTimelineEvent({
        projectId,
        eventType: targetStatus,
        title: `Deliverable Review: ${targetStatus} - ${deliverable.title}`,
        description: data.clientFeedback,
        performedByUserId: userId,
      }),
      projectRepository.createAuditActivity({
        projectId,
        actorUserId: userId,
        requestId: auditMeta.requestId,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        action: `DELIVERABLE_${targetStatus}`,
        details: JSON.stringify({ deliverableId, targetStatus, clientFeedback: data.clientFeedback }),
      }),
    ]);

    return updatedDeliverable;
  }

  /**
   * Upload Evidence with SHA-256 Integrity Verification
   */
  async uploadEvidence(projectId, userId, role, data, auditMeta = {}) {
    await this._verifyProjectAccess(projectId, userId, role);

    let sha256Hash = data.sha256Hash || null;
    if (!sha256Hash && data.fileBuffer) {
      sha256Hash = crypto.createHash('sha256').update(data.fileBuffer).digest('hex');
    }

    const evidence = await projectRepository.createEvidence({
      projectId,
      milestoneId: data.milestoneId || null,
      deliverableId: data.deliverableId || null,
      title: data.title,
      description: data.description || null,
      evidenceType: data.evidenceType || 'DOCUMENT',
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize || null,
      mimeType: data.mimeType || null,
      sha256Hash,
      externalUrl: data.externalUrl || null,
      uploadedByUserId: userId,
    });

    await Promise.all([
      projectRepository.createTimelineEvent({
        projectId,
        eventType: 'EVIDENCE_UPLOADED',
        title: `Evidence Uploaded: ${evidence.title}`,
        description: `File ${evidence.fileName} uploaded (SHA-256: ${sha256Hash || 'N/A'})`,
        performedByUserId: userId,
      }),
      projectRepository.createAuditActivity({
        projectId,
        actorUserId: userId,
        requestId: auditMeta.requestId,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        action: 'EVIDENCE_UPLOADED',
        details: JSON.stringify({ evidenceId: evidence.id, fileName: evidence.fileName, sha256Hash }),
      }),
    ]);

    return evidence;
  }

  /**
   * Upload Categorized Project Attachment
   */
  async uploadAttachment(projectId, userId, role, data, auditMeta = {}) {
    await this._verifyProjectAccess(projectId, userId, role);

    const attachment = await projectRepository.createAttachment({
      projectId,
      deliverableId: data.deliverableId || null,
      category: data.category || 'OTHER',
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileType: data.fileType || null,
      fileSize: data.fileSize || null,
      uploadedByUserId: userId,
    });

    await projectRepository.createAuditActivity({
      projectId,
      actorUserId: userId,
      requestId: auditMeta.requestId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      action: 'ATTACHMENT_UPLOADED',
      details: JSON.stringify({ attachmentId: attachment.id, category: attachment.category, fileName: attachment.fileName }),
    });

    return attachment;
  }

  /**
   * Add Project Comment
   */
  async addComment(projectId, userId, role, data) {
    await this._verifyProjectAccess(projectId, userId, role);

    return projectRepository.createComment({
      projectId,
      milestoneId: data.milestoneId || null,
      deliverableId: data.deliverableId || null,
      authorUserId: userId,
      content: data.content,
    });
  }
}

module.exports = new ProjectService();
