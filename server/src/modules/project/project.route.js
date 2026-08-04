'use strict';

const express = require('express');
const projectController = require('./project.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createProjectSchema,
  updateProjectSchema,
  updateProjectStatusSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createDeliverableSchema,
  submitDeliverableSchema,
  reviewDeliverableSchema,
  createEvidenceSchema,
  createAttachmentSchema,
  createCommentSchema,
  projectSearchQuerySchema,
} = require('../../../../shared/src/validators/project.validator');

const router = express.Router();

// Require authentication for all project routes
router.use(authenticate);

// List & Search Projects
router.get(
  '/',
  validate({ query: projectSearchQuerySchema }),
  projectController.searchProjects.bind(projectController)
);

// Create Project
router.post(
  '/',
  validate({ body: createProjectSchema }),
  projectController.createProject.bind(projectController)
);

// Get Project Details by ID
router.get('/:id', projectController.getProjectById.bind(projectController));

// Update Project Details
router.put(
  '/:id',
  validate({ body: updateProjectSchema }),
  projectController.updateProject.bind(projectController)
);

// Update Project Status (Centralized State Machine)
router.patch(
  '/:id/status',
  validate({ body: updateProjectStatusSchema }),
  projectController.updateProjectStatus.bind(projectController)
);

// Milestones Endpoints
router.post(
  '/:id/milestones',
  validate({ body: createMilestoneSchema }),
  projectController.addMilestone.bind(projectController)
);

router.put(
  '/:id/milestones/:milestoneId',
  validate({ body: updateMilestoneSchema }),
  projectController.updateMilestone.bind(projectController)
);

router.delete(
  '/:id/milestones/:milestoneId',
  projectController.deleteMilestone.bind(projectController)
);

// Deliverables Endpoints
router.post(
  '/:id/deliverables',
  validate({ body: createDeliverableSchema }),
  projectController.addDeliverable.bind(projectController)
);

router.post(
  '/:id/deliverables/:deliverableId/submit',
  validate({ body: submitDeliverableSchema }),
  projectController.submitDeliverable.bind(projectController)
);

router.patch(
  '/:id/deliverables/:deliverableId/review',
  validate({ body: reviewDeliverableSchema }),
  projectController.reviewDeliverable.bind(projectController)
);

// Evidence Endpoint (SHA-256 integrity metadata)
router.post(
  '/:id/evidence',
  validate({ body: createEvidenceSchema }),
  projectController.uploadEvidence.bind(projectController)
);

// Attachment Endpoint (Categorized attachments)
router.post(
  '/:id/attachments',
  validate({ body: createAttachmentSchema }),
  projectController.uploadAttachment.bind(projectController)
);

// Comment Endpoint
router.post(
  '/:id/comments',
  validate({ body: createCommentSchema }),
  projectController.addComment.bind(projectController)
);

module.exports = router;
