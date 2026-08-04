'use strict';

const crypto = require('crypto');
const prisma = require('../../config/database');
const { logger } = require('../../utils/logger');

class WebhookService {
  async registerWebhook(userId, { name, url, events }) {
    const secret = `whsec_${crypto.randomBytes(24).toString('hex')}`;
    const eventsString = Array.isArray(events) ? events.join(',') : events;

    return prisma.webhook.create({
      data: {
        userId,
        name,
        url,
        secret,
        events: eventsString,
        status: 'ACTIVE',
      },
    });
  }

  async getUserWebhooks(userId) {
    return prisma.webhook.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        deliveries: {
          take: 5,
          orderBy: { deliveredAt: 'desc' },
        },
      },
    });
  }

  async deleteWebhook(id, userId) {
    return prisma.webhook.deleteMany({
      where: { id, userId },
    });
  }

  /**
   * Dispatch Webhook Event Payload with HMAC-SHA256 Signature
   */
  async dispatchEvent(eventCode, payload) {
    const webhooks = await prisma.webhook.findMany({
      where: { status: 'ACTIVE' },
    });

    const targetWebhooks = webhooks.filter((wh) => wh.events.split(',').includes(eventCode) || wh.events.includes('*'));

    for (const wh of targetWebhooks) {
      this.sendDelivery(wh, eventCode, payload).catch(() => {});
    }
  }

  async sendDelivery(webhook, eventCode, payload) {
    const payloadString = JSON.stringify({
      event: eventCode,
      data: payload,
      timestamp: new Date().toISOString(),
    });

    const signature = crypto.createHmac('sha256', webhook.secret).update(payloadString).digest('hex');

    let responseCode = null;
    let status = 'SENT';

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TrustPay-Signature': signature,
          'X-TrustPay-Event': eventCode,
        },
        body: payloadString,
      });

      responseCode = response.status;
      status = response.ok ? 'SENT' : 'FAILED';
    } catch (err) {
      logger.error('Webhook HTTP delivery failed', { webhookId: webhook.id, error: err.message });
      status = 'FAILED';
    }

    const delivery = await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event: eventCode,
        payloadJson: payloadString,
        responseCode,
        status,
      },
    });

    if (status === 'SENT') {
      await prisma.webhook.update({
        where: { id: webhook.id },
        data: { lastSuccessAt: new Date() },
      });
    }

    return delivery;
  }

  /**
   * Test Webhook Endpoint
   */
  async testWebhook(webhookId, userId) {
    const webhook = await prisma.webhook.findFirst({
      where: { id: webhookId, userId },
    });

    if (!webhook) {
      throw new Error('Webhook configuration not found');
    }

    return this.sendDelivery(webhook, 'TEST_EVENT', {
      message: 'This is a test webhook payload from TrustPay.',
      testId: crypto.randomUUID(),
    });
  }
}

module.exports = new WebhookService();
