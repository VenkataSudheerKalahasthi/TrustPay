'use strict';

const PDFDocument = require('pdfkit');

class InvoiceService {
  /**
   * Generate PDF Invoice document buffer
   *
   * @param {object} invoice - Full invoice object with clientProfile, workerProfile, contract
   * @returns {Promise<Buffer>}
   */
  async generateInvoicePdf(invoice) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Header / Branding
        doc
          .fillColor('#4f46e5')
          .fontSize(22)
          .font('Helvetica-Bold')
          .text('TrustPay Tax Invoice', { align: 'left' });

        doc
          .fillColor('#64748b')
          .fontSize(9)
          .font('Helvetica')
          .text('Enterprise Escrow Wallet & Digital Contract Billing', { align: 'left' })
          .moveDown(1.5);

        doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

        // Invoice Meta Info
        doc
          .fillColor('#0f172a')
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`Invoice #: ${invoice.invoiceNumber}`, { align: 'left' });

        doc
          .fillColor('#475569')
          .fontSize(10)
          .font('Helvetica')
          .text(`Contract #: ${invoice.contract?.contractNumber || 'N/A'}`)
          .text(`Version: v${invoice.versionNumber || 1}`)
          .text(`Date Issued: ${new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN')}`)
          .moveDown(1);

        // Billed Parties
        const clientUser = invoice.clientProfile?.user || {};
        const workerUser = invoice.workerProfile?.user || {};
        const clientName = `${clientUser.firstName || ''} ${clientUser.lastName || ''}`.trim() || 'Client';
        const workerName = `${workerUser.firstName || ''} ${workerUser.lastName || ''}`.trim() || 'Specialist';

        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('BILLED TO (CLIENT)')
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#334155')
          .text(`${clientName} (${invoice.clientProfile?.companyName || 'Individual'})`)
          .text(`Email: ${clientUser.email || 'N/A'}`)
          .moveDown(1);

        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('PAYEE / SERVICE PROVIDER')
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#334155')
          .text(`${workerName} (${invoice.workerProfile?.title || 'Specialist'})`)
          .text(`Email: ${workerUser.email || 'N/A'}`)
          .moveDown(1.5);

        // Line Items Table
        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('PAYMENT BREAKDOWN', { underline: true })
          .moveDown(0.5);

        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor('#334155')
          .text(`Subtotal Amount: ₹${(invoice.amount || 0).toLocaleString('en-IN')}`)
          .text(`Tax Amount (GST 0% / Exempt): ₹${(invoice.taxAmount || 0).toLocaleString('en-IN')}`)
          .font('Helvetica-Bold')
          .fillColor('#0f172a')
          .text(`Total Amount Paid / Held: ₹${(invoice.totalAmount || invoice.amount || 0).toLocaleString('en-IN')}`)
          .moveDown(1);

        if (invoice.paymentDetailsText) {
          doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('Payment Terms / Notes:')
            .font('Helvetica')
            .fontSize(9)
            .fillColor('#475569')
            .text(invoice.paymentDetailsText)
            .moveDown(1);
        }

        // Footer
        doc
          .fillColor('#94a3b8')
          .fontSize(8)
          .font('Helvetica')
          .text('This is a computer-generated digital invoice. Escrow funds secured by TrustPay.', 50, 720, {
            align: 'center',
          });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new InvoiceService();
