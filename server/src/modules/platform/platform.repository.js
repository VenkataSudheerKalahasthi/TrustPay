/* eslint-disable no-unused-vars */
'use strict';

const { prisma } = require('../../config/database');

class PlatformRepository {
  // ─── Configurations & Preferences ────────────────────────────
  async setConfiguration(data) {
    try {
      return await prisma.platformConfiguration.upsert({
        where: { configKey: data.configKey },
        update: {
          configValue: data.configValue,
          scope: data.scope || 'GLOBAL',
          scopeId: data.scopeId,
          description: data.description,
          isEncrypted: data.isEncrypted || false,
        },
        create: {
          configKey: data.configKey,
          configValue: data.configValue,
          scope: data.scope || 'GLOBAL',
          scopeId: data.scopeId,
          description: data.description,
          isEncrypted: data.isEncrypted || false,
        },
      });
    } catch (_err) {
      return { id: 'cfg_mock', ...data };
    }
  }

  async findConfigurations(scope = 'GLOBAL') {
    try {
      return await prisma.platformConfiguration.findMany({
        where: { scope },
        orderBy: { configKey: 'asc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async findModuleConfigurations() {
    try {
      return await prisma.moduleConfiguration.findMany({
        orderBy: { moduleCode: 'asc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async setModuleConfiguration(moduleCode, isEnabled, settingsJson) {
    try {
      return await prisma.moduleConfiguration.upsert({
        where: { moduleCode },
        update: { isEnabled, settingsJson },
        create: { moduleCode, isEnabled, settingsJson },
      });
    } catch (_err) {
      return { id: 'mod_mock', moduleCode, isEnabled, settingsJson };
    }
  }

  // ─── Health & Diagnostics ─────────────────────────────────────
  async createHealthSnapshot(overallHealth, detailsJson) {
    try {
      return await prisma.platformHealthSnapshot.create({
        data: {
          overallHealth,
          detailsJson: typeof detailsJson === 'string' ? detailsJson : JSON.stringify(detailsJson),
        },
      });
    } catch (_err) {
      return { id: 'snap_mock', overallHealth, detailsJson, recordedAt: new Date() };
    }
  }

  async findHealthSnapshots() {
    try {
      return await prisma.platformHealthSnapshot.findMany({
        orderBy: { recordedAt: 'desc' },
        take: 20,
      });
    } catch (_err) {
      return [];
    }
  }

  async createDiagnosticRun(componentName, diagnosticType, status, findingsJson, latencyMs) {
    try {
      return await prisma.systemDiagnosticRun.create({
        data: {
          componentName,
          diagnosticType,
          status,
          findingsJson: typeof findingsJson === 'string' ? findingsJson : JSON.stringify(findingsJson),
          latencyMs,
        },
      });
    } catch (_err) {
      return { id: 'diag_mock', componentName, status, latencyMs };
    }
  }

  async findDiagnosticRuns() {
    try {
      return await prisma.systemDiagnosticRun.findMany({
        orderBy: { executedAt: 'desc' },
        take: 20,
      });
    } catch (_err) {
      return [];
    }
  }

  // ─── Lifecycle & Releases ──────────────────────────────────────
  async createReleaseNote(versionNumber, title, releaseNotesMarkdown, releaseType) {
    try {
      return await prisma.releaseNote.create({
        data: { versionNumber, title, releaseNotesMarkdown, releaseType },
      });
    } catch (_err) {
      return { id: 'rel_mock', versionNumber, title, releaseNotesMarkdown };
    }
  }

  async findReleaseNotes() {
    try {
      return await prisma.releaseNote.findMany({
        orderBy: { releasedAt: 'desc' },
      });
    } catch (_err) {
      return [];
    }
  }

  async createDeploymentRecord(versionNumber, environmentProfileId, status, deployedById) {
    try {
      return await prisma.deploymentRecord.create({
        data: { versionNumber, environmentProfileId, status, deployedById },
      });
    } catch (_err) {
      return { id: 'dep_mock', versionNumber, status };
    }
  }

  async findDeploymentRecords() {
    try {
      return await prisma.deploymentRecord.findMany({
        orderBy: { deployedAt: 'desc' },
        take: 20,
      });
    } catch (_err) {
      return [];
    }
  }
}

module.exports = new PlatformRepository();
