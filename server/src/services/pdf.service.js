'use strict';

const PDFDocument = require('pdfkit');

class PdfService {
  /**
   * Generate a PDF contract document buffer.
   *
   * @param {object} contract - Full contract object with clientProfile, workerProfile, signatures, versions
   * @returns {Promise<Buffer>}
   */
  async generateContractPdf(contract) {
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
          .text('TrustPay Digital Contract', { align: 'left' });

        doc
          .fillColor('#64748b')
          .fontSize(9)
          .font('Helvetica')
          .text('Enterprise Digital Contract & Milestone Escrow Platform', { align: 'left' })
          .moveDown(1.5);

        doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

        // Contract Info Box
        const clientUser = contract.clientProfile?.user || {};
        const workerUser = contract.workerProfile?.user || {};
        const clientName = `${clientUser.firstName || ''} ${clientUser.lastName || ''}`.trim() || 'Client';
        const workerName = `${workerUser.firstName || ''} ${workerUser.lastName || ''}`.trim() || 'Worker';

        doc
          .fillColor('#0f172a')
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`Contract #: ${contract.contractNumber}`, { align: 'left' });

        doc
          .fillColor('#475569')
          .fontSize(10)
          .font('Helvetica')
          .text(`Title: ${contract.title}`)
          .text(`Version: v${contract.currentVersionNumber || 1}`)
          .text(`Status: ${contract.status}`)
          .text(`Date Generated: ${new Date().toLocaleDateString('en-IN')}`)
          .moveDown(1);

        // Parties Table Section
        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('PARTIES TO THIS AGREEMENT', { underline: true })
          .moveDown(0.5);

        doc
          .fontSize(9)
          .font('Helvetica')
          .text(`Client (Party A): ${clientName} (${contract.clientProfile?.companyName || 'Individual'})`)
          .text(`Client Email: ${clientUser.email || 'N/A'}`)
          .moveDown(0.5)
          .text(`Worker / Specialist (Party B): ${workerName} (${contract.workerProfile?.title || 'Specialist'})`)
          .text(`Worker Email: ${workerUser.email || 'N/A'}`)
          .moveDown(1.5);

        // Scope of Work
        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('1. SCOPE OF WORK')
          .moveDown(0.3);

        doc
          .fillColor('#334155')
          .fontSize(9)
          .font('Helvetica')
          .text(contract.scopeOfWork || 'N/A')
          .moveDown(1);

        // Deliverables
        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('2. DELIVERABLES & MILESTONES')
          .moveDown(0.3);

        doc
          .fillColor('#334155')
          .fontSize(9)
          .font('Helvetica')
          .text(contract.deliverables || 'N/A')
          .moveDown(1);

        // Terms & Conditions
        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('3. TERMS & CONDITIONS')
          .moveDown(0.3);

        doc
          .fillColor('#334155')
          .fontSize(9)
          .font('Helvetica')
          .text(contract.termsAndConditions || 'N/A')
          .moveDown(1.5);

        // Digital Signatures Section
        doc
          .fillColor('#1e293b')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('4. DIGITAL SIGNATURES & AUDIT LOG', { underline: true })
          .moveDown(0.5);

        const signatures = contract.signatures || [];
        if (signatures.length === 0) {
          doc.fillColor('#64748b').fontSize(9).font('Helvetica-Oblique').text('No digital signatures recorded yet.');
        } else {
          signatures.forEach((sig) => {
            const signerName = sig.signerUser ? `${sig.signerUser.firstName} ${sig.signerUser.lastName}` : sig.signerUserId;
            doc
              .fillColor('#0f172a')
              .fontSize(9)
              .font('Helvetica-Bold')
              .text(`Signer: ${signerName} (${sig.signerRole})`)
              .font('Helvetica')
              .fillColor('#475569')
              .text(`Status: ${sig.signatureStatus}`)
              .text(`Timestamp: ${sig.signatureTimestamp ? new Date(sig.signatureTimestamp).toISOString() : 'Pending'}`)
              .text(`IP Address: ${sig.ipAddress || 'Recorded'}`)
              .text(`Signature Hash: ${sig.signatureHash || 'N/A'}`)
              .moveDown(0.8);
          });
        }

        // Footer
        doc
          .fillColor('#94a3b8')
          .fontSize(8)
          .font('Helvetica')
          .text('This document was cryptographically generated by TrustPay. Verified on-chain & database audit logs.', 50, 720, {
            align: 'center',
          });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new PdfService();
