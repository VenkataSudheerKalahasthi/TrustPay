'use strict';

const supportRepository = require('./support.repository');
const notificationService = require('../notification/notification.service');
const activityService = require('../activity/activity.service');

class TicketService {
  /**
   * Create ticket & initialize SLA target deadlines
   */
  async createTicket(data, requesterUserId) {
    // 1. Calculate SLA response due time based on priority
    const priorityHours = {
      CRITICAL: 2,
      URGENT: 4,
      HIGH: 12,
      MEDIUM: 24,
      LOW: 48,
    };
    const hours = priorityHours[data.priority] || 24;
    const responseDueAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    const resolutionDueAt = new Date(Date.now() + hours * 3 * 60 * 60 * 1000);

    const ticket = await supportRepository.createTicket({
      ...data,
      requesterUserId,
      responseDueAt,
      resolutionDueAt,
    });

    // 2. Log activity & trigger notification
    await activityService.logActivity({
      actorUserId: requesterUserId,
      category: 'SUPPORT',
      action: 'CREATE_TICKET',
      title: `Created Support Ticket #${ticket.ticketNumber}`,
    });

    await notificationService.createNotification({
      userId: requesterUserId,
      category: 'SUPPORT',
      priority: 'NORMAL',
      title: `Ticket Submitted #${ticket.ticketNumber}`,
      message: `Your ticket "${ticket.subject}" has been opened. Our support desk will respond shortly.`,
    });

    return ticket;
  }

  async getTicketDetails(id) {
    const ticket = await supportRepository.findTicketById(id);
    if (!ticket) {
      throw new Error('Support ticket not found.');
    }
    return ticket;
  }

  async getTickets(filter = {}) {
    return supportRepository.findTickets(filter);
  }

  async addMessage(ticketId, senderId, body, isInternal = false) {
    const message = await supportRepository.createTicketMessage({
      ticketId,
      senderId,
      body,
      isInternal,
    });

    const ticket = await supportRepository.findTicketById(ticketId);

    // If client/worker replies, update ticket status to IN_PROGRESS
    if (ticket && ticket.status === 'WAITING_CUSTOMER') {
      await supportRepository.updateTicket(ticketId, { status: 'IN_PROGRESS' });
    }

    // Notify ticket requester if sender is support agent
    if (ticket && senderId !== ticket.requesterUserId && !isInternal) {
      await notificationService.createNotification({
        userId: ticket.requesterUserId,
        category: 'SUPPORT',
        priority: 'NORMAL',
        title: `Reply on Ticket #${ticket.ticketNumber}`,
        message: `New message on "${ticket.subject}".`,
      });
    }

    return message;
  }

  async assignAgent(ticketId, assignedToId, assignedById) {
    await supportRepository.createTicketAssignment({
      ticketId,
      assignedById,
      assignedToId,
    });

    const updated = await supportRepository.updateTicket(ticketId, {
      assigneeUserId: assignedToId,
      status: 'IN_PROGRESS',
    });

    await notificationService.createNotification({
      userId: assignedToId,
      category: 'SUPPORT',
      priority: 'HIGH',
      title: `Assigned to Support Ticket #${updated.ticketNumber}`,
      message: `You have been assigned to handle ticket "${updated.subject}".`,
    });

    return updated;
  }

  async updateStatus(ticketId, status, actorUserId) {
    const updateData = { status };
    if (status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    } else if (status === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    const ticket = await supportRepository.updateTicket(ticketId, updateData);

    await activityService.logActivity({
      actorUserId,
      category: 'SUPPORT',
      action: 'UPDATE_TICKET_STATUS',
      title: `Updated Ticket #${ticket.ticketNumber} to ${status}`,
    });

    await notificationService.createNotification({
      userId: ticket.requesterUserId,
      category: 'SUPPORT',
      priority: 'HIGH',
      title: `Ticket #${ticket.ticketNumber} ${status}`,
      message: `Your ticket "${ticket.subject}" has been marked as ${status.toLowerCase()}.`,
    });

    return ticket;
  }
}

module.exports = new TicketService();
