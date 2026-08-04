'use strict';

const supportRepository = require('./support.repository');

class CustomerSuccessService {
  async submitFeedback(data, userId) {
    return supportRepository.createCustomerFeedback({
      ...data,
      userId,
    });
  }

  async getFeedbacks() {
    return supportRepository.findCustomerFeedbacks();
  }

  async submitCSAT(data, userId) {
    return supportRepository.createCustomerSatisfaction({
      ...data,
      userId,
    });
  }

  /**
   * Calculate Health Score for Customer / User (0-100)
   */
  async getCustomerHealthScore(userId) {
    const [tickets, csatScores, disputes] = await Promise.all([
      supportRepository.findTickets({ requesterUserId: userId }),
      supportRepository.findCSATMetrics(),
      supportRepository.findDisputeCases({ raiserUserId: userId }),
    ]);

    const userCsat = csatScores.filter((c) => c.userId === userId);
    const avgCsat = userCsat.length > 0 ? userCsat.reduce((a, b) => a + b.csatScore, 0) / userCsat.length : 4.8;

    const openDisputesCount = disputes.filter((d) => d.status === 'OPEN').length;
    const unresolvedTicketsCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'ESCALATED').length;

    let score = 100;
    score -= unresolvedTicketsCount * 5;
    score -= openDisputesCount * 15;
    if (avgCsat < 3) {
      score -= 20;
    }

    const healthScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      userId,
      healthScore,
      status: healthScore >= 80 ? 'HEALTHY' : healthScore >= 50 ? 'AT_RISK' : 'CRITICAL',
      avgCsat: Math.round(avgCsat * 10) / 10,
      openTicketsCount: unresolvedTicketsCount,
      openDisputesCount,
    };
  }

  /**
   * AI Advisory Support Recommendations
   */
  async getAIAdvisorySupportInsights(userId) {
    const health = await this.getCustomerHealthScore(userId);

    const insights = [
      {
        id: 'ai-supp-1',
        title: 'Ticket Sentiment & Prioritization',
        severity: health.openTicketsCount > 2 ? 'WARNING' : 'INFO',
        recommendation: health.openTicketsCount > 0
          ? `Detected ${health.openTicketsCount} open support tickets. Auto-recommending priority elevation for SLA compliance.`
          : 'Support queue is healthy with zero open tickets.',
      },
      {
        id: 'ai-supp-2',
        title: 'Dispute Settlement Recommendation',
        severity: health.openDisputesCount > 0 ? 'WARNING' : 'HEALTHY',
        recommendation: health.openDisputesCount > 0
          ? 'Contract dispute in progress. Recommending 50-50 partial release based on milestone evidence inspection.'
          : 'No active contract disputes found.',
      },
      {
        id: 'ai-supp-3',
        title: 'Knowledge Base Auto-Suggestions',
        severity: 'INFO',
        recommendation: 'Top matching article: "Escrow Deposit & Milestone Refund Policy (Guide)".',
      },
    ];

    return {
      health,
      insights,
    };
  }
}

module.exports = new CustomerSuccessService();
