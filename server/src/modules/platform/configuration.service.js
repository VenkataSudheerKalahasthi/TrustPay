'use strict';

const platformRepository = require('./platform.repository');

class ConfigurationService {
  async setConfiguration(data, userId) {
    const config = await platformRepository.setConfiguration(data);
    await platformRepository.logPlatformAudit('UPDATE_CONFIG', 'PLATFORM_CONFIGURATION', config.id, userId, data);
    return config;
  }

  async getConfigurations(scope = 'GLOBAL') {
    let configs = await platformRepository.findConfigurations(scope);
    if (configs.length === 0) {
      const defaultConfigs = [
        { configKey: 'PLATFORM_NAME', configValue: 'TrustPay Enterprise', scope: 'GLOBAL', description: 'Core Application Branding' },
        { configKey: 'DEFAULT_CURRENCY', configValue: 'INR', scope: 'GLOBAL', description: 'Base Currency Token' },
        { configKey: 'STANDARD_GST_RATE', configValue: '18.0', scope: 'GLOBAL', description: 'Standard GST Percentage' },
        { configKey: 'MAX_FILE_UPLOAD_MB', configValue: '25', scope: 'GLOBAL', description: 'Global File Attachment Limit' },
      ];

      configs = await Promise.all(
        defaultConfigs.map((c) => platformRepository.setConfiguration(c))
      );
    }
    return configs;
  }

  async getModuleConfigurations() {
    let modules = await platformRepository.findModuleConfigurations();
    if (modules.length === 0) {
      const defaultModules = [
        { moduleCode: 'MARKETPLACE', isEnabled: true, settingsJson: JSON.stringify({ maxActiveJobs: 100 }) },
        { moduleCode: 'WORKFORCE', isEnabled: true, settingsJson: JSON.stringify({ autoOvertimeApproval: false }) },
        { moduleCode: 'FINANCE', isEnabled: true, settingsJson: JSON.stringify({ multiCurrencyEnabled: true }) },
        { moduleCode: 'SUPPORT', isEnabled: true, settingsJson: JSON.stringify({ csatSurveyEnabled: true }) },
        { moduleCode: 'ANALYTICS', isEnabled: true, settingsJson: JSON.stringify({ aiInsightsIntervalHours: 24 }) },
      ];

      modules = await Promise.all(
        defaultModules.map((m) => platformRepository.setModuleConfiguration(m.moduleCode, m.isEnabled, m.settingsJson))
      );
    }
    return modules;
  }
}

module.exports = new ConfigurationService();
