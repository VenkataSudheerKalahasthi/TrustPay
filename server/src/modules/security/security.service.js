'use strict';

const securityRepository = require('./security.repository');

class SecurityService {
  async getSecurityDashboard(userId) {
    const [loginHistory, trustedDevices, activeSessions, incidents] = await Promise.all([
      securityRepository.getLoginHistory(userId, 10),
      securityRepository.getTrustedDevices(userId),
      securityRepository.getActiveSessions(userId),
      securityRepository.getSecurityIncidents(userId),
    ]);

    // Calculate dynamic security health score (0-100)
    let score = 85;
    if (activeSessions.length > 3) {
      score -= 10;
    }
    if (incidents.some((i) => i.status === 'OPEN')) {
      score -= 15;
    }
    if (trustedDevices.length === 0) {
      score -= 5;
    }
    score = Math.max(0, Math.min(100, score));

    const recommendations = [
      { id: 'rec-1', title: 'Revoke Inactive Sessions', desc: 'You have active sessions on multiple devices.' },
      { id: 'rec-2', title: 'Enable 2FA Authentication', desc: 'Secure your account with two-factor authentication.' },
      { id: 'rec-3', title: 'Verify Trusted Devices', desc: 'Ensure your recognized browser fingerprints are up-to-date.' },
    ];

    return {
      securityScore: score,
      loginHistory,
      trustedDevices,
      activeSessions,
      incidents,
      recommendations,
    };
  }

  async revokeSession(sessionId, userId) {
    return securityRepository.revokeSession(sessionId, userId);
  }

  async reportIncident(userId, data) {
    return securityRepository.createSecurityIncident(userId, data);
  }
}

module.exports = new SecurityService();
