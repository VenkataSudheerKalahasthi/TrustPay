'use strict';

const express = require('express');
const fileController = require('./file.controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { createFileAssetSchema, createShareLinkSchema } = require('../../../../shared/src/validators/securityFile.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', validate({ body: createFileAssetSchema }), fileController.createFile.bind(fileController));
router.get('/', fileController.getFiles.bind(fileController));
router.get('/storage-stats', fileController.getStorageStats.bind(fileController));
router.get('/:id', fileController.getFileDetails.bind(fileController));
router.post('/:id/versions', fileController.addFileVersion.bind(fileController));
router.post('/:id/share', validate({ body: createShareLinkSchema }), fileController.createShareLink.bind(fileController));
router.patch('/:id/favorite', fileController.toggleFavorite.bind(fileController));
router.delete('/:id', fileController.deleteFile.bind(fileController));

module.exports = router;
