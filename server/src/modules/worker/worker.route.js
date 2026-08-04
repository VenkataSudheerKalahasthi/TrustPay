'use strict';

const express = require('express');
const multer = require('multer');
const workerController = require('./worker.controller');
const { authenticate } = require('../../middlewares/auth');

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype.includes('document')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents allowed.'));
    }
  },
});

const router = express.Router();

// Public routes
router.get('/search', workerController.searchWorkers);
router.get('/public/:slugOrId', workerController.getPublicProfile);

// Authenticated routes
router.use(authenticate);
router.get('/me', workerController.getMyProfile);
router.put('/me', workerController.updateProfile);
router.post('/portfolio', workerController.addPortfolioProject);
router.delete('/portfolio/:id', workerController.deletePortfolioProject);
router.post('/upload', upload.single('file'), workerController.uploadFile);
router.post('/verification-docs', workerController.submitVerificationDocument);

module.exports = router;
