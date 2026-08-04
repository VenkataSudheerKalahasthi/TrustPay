'use strict';

const platformRepository = require('./platform.repository');

class PlatformHealthService {
  async getHealthStatus() {
    const details = {
      database: 'HEALTHY',
      redisCache: 'HEALTHY',
      storageEngine: 'HEALTHY',
      apiGateway: 'HEALTHY',
      aiAssistant: 'HEALTHY',
      uptimeSeconds: Math.round(process.uptime()),
    };

    const snapshot = await platformRepository.createHealthSnapshot('HEALTHY', details);
    return {
      overallHealth: snapshot.overallHealth,
      recordedAt: snapshot.recordedAt,
      details,
    };
  }

  async getHealthHistory() {
    return platformRepository.findHealthSnapshots();
  }
}

module.exports = new PlatformHealthService();
