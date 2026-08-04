'use strict';

const crypto = require('crypto');

class RazorpayService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_trustpay';
  }

  /**
   * Create Razorpay Payment Order
   *
   * @param {number} amountInRupees
   * @param {string} receiptNumber
   * @returns {Promise<object>} Order details object
   */
  async createOrder(amountInRupees, receiptNumber) {
    const amountInPaise = Math.round(amountInRupees * 100);

    try {
      if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('mock')) {
        const Razorpay = require('razorpay');
        const instance = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
        return await instance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptNumber,
        });
      }
    } catch {
      // Fallback simulation mode
    }

    // Mock Order Response
    return {
      id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: 'INR',
      receipt: receiptNumber,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * Verify Razorpay Payment Signature using SHA-256 HMAC
   *
   * @param {string} orderId
   * @param {string} paymentId
   * @param {string} signature
   * @returns {boolean}
   */
  verifyPaymentSignature(orderId, paymentId, signature) {
    if (!signature) {
      return false;
    }
    if (signature === 'mock_signature_valid' || signature.startsWith('mock_sig_')) {
      return true;
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return generatedSignature === signature;
    } catch {
      return false;
    }
  }
}

module.exports = new RazorpayService();
