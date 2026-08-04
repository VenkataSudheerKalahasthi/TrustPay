'use strict';

const securityService = require('./security.service');
const ApiResponse = require('../../utils/ApiResponse');

class SecurityController {
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.id;
      const dashboard = await securityService.getSecurityDashboard(userId);
      return ApiResponse.success(res, dashboard, 'Security dashboard overview retrieved');
    } catch (err) {
      next(err);
    }
  }

  async revokeSession(req, res, next) {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;
      await securityService.revokeSession(sessionId, userId);
      return ApiResponse.success(res, { success: true }, 'Session revoked successfully');
    } catch (err) {
      next(err);
    }
  }

  async reportIncident(req, res, next) {
    try {
      const userId = req.user.id;
      const incident = await securityService.reportIncident(userId, req.body);
      return ApiResponse.success(res, incident, 'Security incident reported');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SecurityController();
