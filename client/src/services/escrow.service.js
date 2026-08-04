import api from './api';

export const escrowService = {
  getWallet: async () => {
    const response = await api.get('/escrow/wallet');
    return response.data.data;
  },

  createDepositOrder: async (amount, contractId, idempotencyKey) => {
    const response = await api.post(
      '/escrow/deposit/order',
      { amount, contractId, idempotencyKey },
      { headers: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {} }
    );
    return response.data.data;
  },

  verifyPayment: async (paymentDetails, idempotencyKey) => {
    const response = await api.post(
      '/escrow/deposit/verify',
      paymentDetails,
      { headers: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {} }
    );
    return response.data.data;
  },

  releaseFunds: async (releaseData, idempotencyKey) => {
    const response = await api.post(
      '/escrow/release',
      releaseData,
      { headers: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {} }
    );
    return response.data.data;
  },

  refundFunds: async (refundData, idempotencyKey) => {
    const response = await api.post(
      '/escrow/refund',
      refundData,
      { headers: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {} }
    );
    return response.data.data;
  },

  searchTransactions: async (params) => {
    const response = await api.get('/escrow/transactions', { params });
    return response.data.data;
  },

  searchInvoices: async (params) => {
    const response = await api.get('/escrow/invoices', { params });
    return response.data.data;
  },

  downloadInvoicePdf: async (id) => {
    const response = await api.get(`/escrow/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
