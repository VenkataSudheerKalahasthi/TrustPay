import { FileCheck, Download } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function ComplianceReportCard({ report }) {
  return (
    <Card className="p-4 bg-card border-surface-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
          <FileCheck size={20} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-surface-900">{report.reportType}</h4>
          <span className="text-3xs font-mono text-surface-600">
            Generated: {new Date(report.generatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <a
        href={report.fileUrl || '#'}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-xl bg-surface-50 text-surface-700 hover:text-primary-600 transition-colors"
      >
        <Download size={16} />
      </a>
    </Card>
  );
}

