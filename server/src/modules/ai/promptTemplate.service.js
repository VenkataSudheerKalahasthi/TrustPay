'use strict';

const prisma = require('../../config/database');

const SYSTEM_PROMPT_TEMPLATES = [
  {
    code: 'CONTRACT_SUMMARIZER',
    title: 'Summarize Contract & Terms',
    category: 'CONTRACT',
    promptText: 'Analyze and summarize the key clauses, deliverables, payment terms, and risk factors of this contract:',
    suggestedVariablesJson: JSON.stringify(['contractNumber', 'deliverables', 'termsAndConditions']),
  },
  {
    code: 'PROJECT_RISK_ANALYSIS',
    title: 'Project Milestone Risk Audit',
    category: 'PROJECT',
    promptText: 'Evaluate the timeline feasibility, milestone progress, and potential delays for this project:',
    suggestedVariablesJson: JSON.stringify(['projectTitle', 'milestones', 'estimatedDuration']),
  },
  {
    code: 'WRITING_POLISH',
    title: 'Polite & Professional Rewrite',
    category: 'WRITING',
    promptText: 'Rewrite the following message in a clear, courteous, and professional corporate tone:',
    suggestedVariablesJson: JSON.stringify(['messageText']),
  },
  {
    code: 'TASK_EXTRACTION',
    title: 'Action Item & Deliverables Extractor',
    category: 'SUMMARY',
    promptText: 'Extract a bulleted list of actionable tasks, deadlines, and responsibilities from the following scope:',
    suggestedVariablesJson: JSON.stringify(['scopeText']),
  },
];

class PromptTemplateService {
  async getPromptTemplates({ category } = {}) {
    // Ensure system templates exist
    const count = await prisma.aiPromptTemplate.count();
    if (count === 0) {
      await prisma.aiPromptTemplate.createMany({
        data: SYSTEM_PROMPT_TEMPLATES,
      });
    }

    const where = {};
    if (category) {
      where.category = category;
    }

    return prisma.aiPromptTemplate.findMany({
      where,
      orderBy: [{ isFavorite: 'desc' }, { usageCount: 'desc' }],
    });
  }

  async incrementUsage(templateCode) {
    return prisma.aiPromptTemplate.updateMany({
      where: { code: templateCode },
      data: { usageCount: { increment: 1 } },
    });
  }
}

module.exports = new PromptTemplateService();
