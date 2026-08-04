'use strict';

const express = require('express');
const securityController = require('./security.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { createSecurityIncidentSchema } = require('../../../../shared/src/validators/securityFile.validator');

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', securityController.getDashboard.bind(securityController));
router.delete('/sessions/:sessionId', securityController.revokeSession.bind(securityController));
router.post('/incidents', validate({ body: createSecurityIncidentSchema }), securityController.reportIncident.bind(securityController));

module.exports = router;
