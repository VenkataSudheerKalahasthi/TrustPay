'use strict';

const taxonomyRepository = require('./taxonomy.repository');

class TaxonomyService {
  async getTaxonomies() {
    await taxonomyRepository.seedDefaultTaxonomies();

    const [categories, skills, technologies, languages] = await Promise.all([
      taxonomyRepository.getAllCategories(),
      taxonomyRepository.getAllSkills(),
      taxonomyRepository.getAllTechnologies(),
      taxonomyRepository.getAllLanguages(),
    ]);

    return {
      categories,
      skills,
      technologies,
      languages,
    };
  }
}

module.exports = new TaxonomyService();
