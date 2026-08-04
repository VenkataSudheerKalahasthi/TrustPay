'use strict';

const aiRepository = require('./ai.repository');
const { GeminiProvider } = require('./providers/aiProvider');
const promptTemplateService = require('./promptTemplate.service');
const prisma = require('../../config/database');

class AiService {
  constructor() {
    this.provider = new GeminiProvider();
  }

  /**
   * Process AI Prompt / Conversation Message
   */
  async processPrompt(userId, { prompt, conversationId, contextType, contextId, action = 'CHAT' }) {
    let conversation = null;

    // 1. Fetch or create AI conversation
    if (conversationId) {
      conversation = await aiRepository.findConversationById(conversationId, userId);
    }

    if (!conversation) {
      // Auto-generate title from first 5 words of prompt
      const generatedTitle = prompt.split(' ').slice(0, 5).join(' ') || 'New AI Assistant Chat';

      conversation = await aiRepository.createConversation({
        userId,
        title: generatedTitle,
        provider: 'GEMINI',
        model: 'gemini-2.5-flash',
        contextType: contextType || null,
        contextId: contextId || null,
      });
    }

    // 2. Build Context String from Database if context parameters provided
    const contextString = await this.buildContextString(contextType, contextId);
    const fullPrompt = contextString ? `[CONTEXT DATA]:\n${contextString}\n\n[USER PROMPT]:\n${prompt}` : prompt;

    // 3. Save User Message
    await aiRepository.createMessage({
      conversationId: conversation.id,
      role: 'USER',
      content: prompt,
      tokensUsed: Math.ceil(prompt.length / 4),
    });

    // 4. Generate AI Completion via Gemini Provider
    const completion = await this.provider.generateCompletion(fullPrompt, { action });

    // 5. Save Assistant Message
    const assistantMessage = await aiRepository.createMessage({
      conversationId: conversation.id,
      role: 'ASSISTANT',
      content: completion.content,
      tokensUsed: completion.completionTokens,
      metadataJson: JSON.stringify({ action, contextType, contextId }),
    });

    // 6. Log Token Usage
    await aiRepository.logUsage({
      userId,
      promptTokens: completion.promptTokens,
      completionTokens: completion.completionTokens,
      totalTokens: completion.promptTokens + completion.completionTokens,
      action,
    });

    // Touch conversation updatedAt
    await aiRepository.updateConversation(conversation.id, userId, { updatedAt: new Date() });

    return {
      conversationId: conversation.id,
      title: conversation.title,
      message: assistantMessage,
    };
  }

  /**
   * Helper to compile context string for Projects, Contracts, Messages, Profiles
   */
  async buildContextString(contextType, contextId) {
    if (!contextType || !contextId) {
      return null;
    }

    try {
      if (contextType === 'CONTRACT') {
        const contract = await prisma.contract.findUnique({
          where: { id: contextId },
          select: { contractNumber: true, title: true, deliverables: true, termsAndConditions: true, totalAmount: true, status: true },
        });
        if (contract) {
          return `Contract Number: ${contract.contractNumber}\nTitle: ${contract.title}\nStatus: ${contract.status}\nAmount: ₹${contract.totalAmount}\nDeliverables: ${contract.deliverables}\nTerms: ${contract.termsAndConditions}`;
        }
      }

      if (contextType === 'PROJECT') {
        const project = await prisma.project.findUnique({
          where: { id: contextId },
          select: { projectNumber: true, title: true, description: true, status: true, estimatedBudget: true },
        });
        if (project) {
          return `Project Number: ${project.projectNumber}\nTitle: ${project.title}\nStatus: ${project.status}\nBudget: ₹${project.estimatedBudget}\nDescription: ${project.description}`;
        }
      }

      if (contextType === 'MESSAGE') {
        const message = await prisma.message.findUnique({
          where: { id: contextId },
          select: { content: true, sender: { select: { firstName: true, lastName: true } } },
        });
        if (message) {
          return `Message from ${message.sender?.firstName || 'User'}: "${message.content}"`;
        }
      }
    } catch {
      // Ignore context fetch error gracefully
    }

    return null;
  }

  /**
   * Summarize Document or Context
   */
  async summarize(userId, { text, contextType, contextId }) {
    const prompt = text || 'Please summarize the key details of this document.';
    return this.processPrompt(userId, {
      prompt,
      contextType,
      contextId,
      action: 'SUMMARIZE',
    });
  }

  /**
   * Writing Assistant (Rewrite, Expand, Shorten, Professional, Grammar)
   */
  async assistWriting(userId, { text, action = 'REWRITE' }) {
    const actionPrompts = {
      REWRITE: `Rewrite the following text for optimal clarity and readability:\n"${text}"`,
      EXPAND: `Elaborate and provide comprehensive context for the following text:\n"${text}"`,
      SHORTEN: `Condense the following text into a concise summary:\n"${text}"`,
      PROFESSIONAL: `Convert the following text into a professional executive tone:\n"${text}"`,
      GRAMMAR: `Fix spelling, grammar, and punctuation errors in the following text:\n"${text}"`,
      EXTRACT_TASKS: `Extract all actionable tasks and deliverables from the following text:\n"${text}"`,
    };

    const prompt = actionPrompts[action] || actionPrompts.REWRITE;
    return this.processPrompt(userId, { prompt, action });
  }

  /**
   * Get User AI Conversations
   */
  async getUserConversations(userId, options) {
    return aiRepository.findUserConversations(userId, options);
  }

  /**
   * Get Conversation Details
   */
  async getConversation(id, userId) {
    return aiRepository.findConversationById(id, userId);
  }

  /**
   * Toggle Pin Conversation
   */
  async togglePinConversation(id, userId, isPinned) {
    return aiRepository.updateConversation(id, userId, { isPinned });
  }

  /**
   * Toggle Archive Conversation
   */
  async toggleArchiveConversation(id, userId, isArchived) {
    return aiRepository.updateConversation(id, userId, { isArchived });
  }

  /**
   * Submit Message Feedback (Thumbs Up / Down)
   */
  async submitFeedback(messageId, { feedbackScore, feedbackText }) {
    return aiRepository.updateMessageFeedback(messageId, { feedbackScore, feedbackText });
  }

  /**
   * Get Prompt Templates
   */
  async getPromptTemplates(query) {
    return promptTemplateService.getPromptTemplates(query);
  }
}

module.exports = new AiService();
