'use strict';

const express = require('express');
const clientController = require('./client.controller');
const { authenticate } = require('../../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/me', clientController.getMyProfile);
router.put('/me', clientController.updateProfile);
router.get('/favorites', clientController.getFavoriteWorkers);
router.post('/favorites/:workerProfileId', clientController.addFavoriteWorker);
router.delete('/favorites/:workerProfileId', clientController.removeFavoriteWorker);

module.exports = router;
