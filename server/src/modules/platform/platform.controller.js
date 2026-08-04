'use strict';

const configurationService = require('./configuration.service');
const platformHealthService = require('./platformHealth.service');
const diagnosticService = require('./diagnostic.service');
const releaseService = require('./release.service');
const governanceService = require('./governance.service');
const ApiResponse = require('../../utils/ApiResponse');

class PlatformController {
  // Configurations & Preferences
  async getConfigurations(req, res, next) {
    try {
      const configs = await configurationService.getConfigurations(req.query.scope);
      return ApiResponse.success(res, configs, 'Platform configurations retrieved');
    } catch (err) {
      next(err);
    }
  }

  async setConfiguration(req, res, next) {
    try {
      const config = await configurationService.setConfiguration(req.body, req.user.id);
      return ApiResponse.success(res, config, 'Platform configuration set', 201);
    } catch (err) {
      next(err);
    }
  }

  async getModuleConfigurations(req, res, next) {
    try {
      const modules = await configurationService.getModuleConfigurations();
      return ApiResponse.success(res, modules, 'Module configurations retrieved');
    } catch (err) {
      next(err);
    }
  }

  // Health
  async getHealthStatus(req, res, next) {
    try {
      const health = await platformHealthService.getHealthStatus();
      return ApiResponse.success(res, health, 'Platform health status retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getHealthHistory(req, res, next) {
    try {
      const history = await platformHealthService.getHealthHistory();
      return ApiResponse.success(res, history, 'Platform health history retrieved');
    } catch (err) {
      next(err);
    }
  }

  // Diagnostics
  async runDiagnostics(req, res, next) {
    try {
      const results = await diagnosticService.runDiagnostics(req.body.component);
      return ApiResponse.success(res, results, 'System diagnostics executed');
    } catch (err) {
      next(err);
    }
  }

  async getDiagnosticHistory(req, res, next) {
    try {
      const history = await diagnosticService.getDiagnosticHistory();
      return ApiResponse.success(res, history, 'Diagnostic history retrieved');
    } catch (err) {
      next(err);
    }
  }

  // Releases & Versions
  async getVersions(req, res, next) {
    try {
      const versions = await releaseService.getVersions();
      return ApiResponse.success(res, versions, 'Application versions retrieved');
    } catch (err) {
      next(err);
    }
  }

  async createVersion(req, res, next) {
    try {
      const version = await releaseService.createVersion(req.body);
      return ApiResponse.success(res, version, 'Application version created', 201);
    } catch (err) {
      next(err);
    }
  }

  async addReleaseNote(req, res, next) {
    try {
      const note = await releaseService.addReleaseNote(req.body);
      return ApiResponse.success(res, note, 'Release note added', 201);
    } catch (err) {
      next(err);
    }
  }

  // Governance & Maintenance
  async getRunbooks(req, res, next) {
    try {
      const runbooks = await governanceService.getRunbooks();
      return ApiResponse.success(res, runbooks, 'Operational runbooks retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getMaintenanceSchedules(req, res, next) {
    try {
      const schedules = await governanceService.getMaintenanceSchedules();
      return ApiResponse.success(res, schedules, 'Maintenance schedules retrieved');
    } catch (err) {
      next(err);
    }
  }

  async scheduleMaintenance(req, res, next) {
    try {
      const schedule = await governanceService.scheduleMaintenance(req.body, req.user.id);
      return ApiResponse.success(res, schedule, 'Maintenance scheduled', 201);
    } catch (err) {
      next(err);
    }
  }

  async getGovernanceSummary(req, res, next) {
    try {
      const summary = await governanceService.getGovernanceSummary();
      return ApiResponse.success(res, summary, 'Governance summary retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlatformController();
