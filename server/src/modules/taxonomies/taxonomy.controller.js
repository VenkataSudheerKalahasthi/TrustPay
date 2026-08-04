'use strict';

const taxonomyService = require('./taxonomy.service');
const ApiResponse = require('../../utils/ApiResponse');

class TaxonomyController {
  async getTaxonomies(req, res, next) {
    try {
      const data = await taxonomyService.getTaxonomies();
      return ApiResponse.success(res, data, 'Taxonomies retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TaxonomyController();
