'use strict';

const supportRepository = require('./support.repository');

class SLAService {
  async createSLAPolicy(data) {
    return supportRepository.createSLAPolicy(data);
  }

  async getSLAPolicies() {
    return supportRepository.findSLAPolicies();
  }

  /**
   * Monitor ticket SLAs and evaluate breach / warning status
   */
  async evaluateTicketSLA(ticketId) {
    const ticket = await supportRepository.findTicketById(ticketId);
    if (!ticket) {
      return null;
    }

    const now = new Date();
    let status = 'ON_TRACK';

    if (ticket.resolutionDueAt && now > ticket.resolutionDueAt && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED') {
      status = 'BREACHED';
    } else if (ticket.resolutionDueAt && ticket.resolutionDueAt.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
      status = 'AT_RISK';
    }

    if (status !== ticket.slaStatus) {
      await supportRepository.updateTicket(ticketId, { slaStatus: status });
    }

    return { ticketId, slaStatus: status, resolutionDueAt: ticket.resolutionDueAt };
  }
}

module.exports = new SLAService();
