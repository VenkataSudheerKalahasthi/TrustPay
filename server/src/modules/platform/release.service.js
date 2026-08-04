'use strict';

const platformRepository = require('./platform.repository');

class ReleaseService {
  async createVersion(data) {
    return platformRepository.createApplicationVersion(data);
  }

  async getVersions() {
    let versions = await platformRepository.findApplicationVersions();
    if (versions.length === 0) {
      const defaultVersion = await platformRepository.createApplicationVersion({
        version: '2.0.0',
        buildNumber: 'BUILD-20260803',
        releaseDate: new Date(),
        isCurrent: true,
      });

      await platformRepository.createReleaseNote({
        applicationVersionId: defaultVersion.id,
        title: 'TrustPay v2.0.0 Enterprise Release',
        category: 'FEATURE',
        content: 'Full platform production release containing Phase 1 through Phase 4 governance, business intelligence, workforce operations, customer success, and finance.',
      });

      versions = await platformRepository.findApplicationVersions();
    }
    return versions;
  }

  async addReleaseNote(data) {
    return platformRepository.createReleaseNote(data);
  }
}

module.exports = new ReleaseService();
