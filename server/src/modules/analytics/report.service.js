'use strict';

const PDFDocument = require('pdfkit');
const prisma = require('../../config/database');
const analyticsService = require('./analytics.service');

class ReportService {
  /**
   * Fetch Analytics Data for User Role
   */
  async _fetchReportData(userId, userRole, filters) {
    if (userRole === 'CLIENT') {
      return analyticsService.getClientDashboard(userId, filters.dateRange || 'MONTHLY');
    }
    if (userRole === 'WORKER') {
      return analyticsService.getWorkerDashboard(userId, filters.dateRange || 'MONTHLY');
    }
    return analyticsService.getAdminDashboard(userId, userRole, filters.dateRange || 'MONTHLY');
  }

  /**
   * Generate PDF Report
   */
  async generatePDFReport(userId, userRole, reportType = 'FINANCIAL', filters = {}) {
    const data = await this._fetchReportData(userId, userRole, filters);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);

          // Record ReportExport entry in DB asynchronously
          prisma.reportExport
            .create({
              data: {
                userId,
                reportType,
                format: 'PDF',
                fileSize: pdfData.length,
                status: 'COMPLETED',
              },
            })
            .then(() => resolve(pdfData))
            .catch((err) => reject(err));
        });

        // ── Header Banner ──
        doc.fillColor('#0ea5e9').fontSize(22).text('TrustPay Enterprise Analytics Report', { align: 'center' });
        doc.moveDown(0.5);
        doc.fillColor('#64748b').fontSize(10).text(`Generated for: User #${userId} (${userRole})`, { align: 'center' });
        doc.text(`Date: ${new Date().toLocaleDateString()} | Type: ${reportType}`, { align: 'center' });
        doc.moveDown(1.5);

        // ── Data Content ──
        doc.fillColor('#0f172a').fontSize(14).text('Key Metrics Summary', { underline: true });
        doc.moveDown(0.5);

        const metrics = data.metrics || {};
        Object.keys(metrics).forEach((key) => {
          const val = typeof metrics[key] === 'number' ? metrics[key].toLocaleString() : JSON.stringify(metrics[key]);
          doc.fillColor('#334155').fontSize(11).text(`• ${key.replace(/([A-Z])/g, ' $1')}: ${val}`);
        });

        doc.moveDown(1.5);
        doc.fillColor('#0f172a').fontSize(14).text('Monthly Trends Analysis', { underline: true });
        doc.moveDown(0.5);

        const trends = data.trends || [];
        trends.forEach((t) => {
          doc.fillColor('#334155').fontSize(10).text(`Month: ${t.name} | GMV: ₹${t.gmv?.toLocaleString()} | Revenue: ₹${t.revenue?.toLocaleString()}`);
        });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generate CSV Report
   */
  async generateCSVReport(userId, userRole, reportType = 'FINANCIAL', filters = {}) {
    const data = await this._fetchReportData(userId, userRole, filters);

    const rows = ['Metric,Value'];
    const metrics = data.metrics || {};
    Object.keys(metrics).forEach((k) => {
      const val = typeof metrics[k] === 'number' ? metrics[k] : JSON.stringify(metrics[k]);
      rows.push(`"${k}","${val}"`);
    });

    const csvContent = rows.join('\n');

    await prisma.reportExport.create({
      data: {
        userId,
        reportType,
        format: 'CSV',
        fileSize: Buffer.byteLength(csvContent, 'utf-8'),
        status: 'COMPLETED',
      },
    });

    return csvContent;
  }

  /**
   * Generate Excel Compatible Report
   */
  async generateExcelReport(userId, userRole, reportType = 'FINANCIAL', filters = {}) {
    return this.generateCSVReport(userId, userRole, reportType, filters);
  }
}

module.exports = new ReportService();
