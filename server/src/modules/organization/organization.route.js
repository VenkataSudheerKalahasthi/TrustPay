'use strict';

const express = require('express');
const organizationController = require('./organization.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createOrgSchema,
  inviteMemberSchema,
  createWorkspaceSchema,
} = require('../../../../shared/src/validators/adminOrg.validator');

const router = express.Router();

router.use(authenticate);

// Create & List Organizations
router.post('/', validate({ body: createOrgSchema }), organizationController.createOrganization.bind(organizationController));
router.get('/', organizationController.getOrganizations.bind(organizationController));
router.get('/:id', organizationController.getOrganization.bind(organizationController));

// Invitations & Members
router.post('/:id/invite', validate({ body: inviteMemberSchema }), organizationController.inviteMember.bind(organizationController));
router.patch('/:id/members/:memberUserId/role', organizationController.updateMemberRole.bind(organizationController));
router.delete('/:id/members/:memberUserId', organizationController.removeMember.bind(organizationController));

// Workspaces
router.post('/:id/workspaces', validate({ body: createWorkspaceSchema }), organizationController.createWorkspace.bind(organizationController));

module.exports = router;
