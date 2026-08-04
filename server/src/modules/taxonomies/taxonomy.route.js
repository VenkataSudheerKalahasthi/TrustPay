'use strict';

const express = require('express');
const taxonomyController = require('./taxonomy.controller');

const router = express.Router();

router.get('/', taxonomyController.getTaxonomies);

module.exports = router;
