import { FileCheck, Download } from 'lucide-react';
import { Card } from '@components/ui/Card';

export function ComplianceReportCard({ report }) {
  return (
    <Card className="p-4 bg-surface-900 border-surface-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400">
          <FileCheck size={20} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-surface-100">{report.reportType}</h4>
          <span className="text-3xs font-mono text-surface-400">
            Generated: {new Date(report.generatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <a
        href={report.fileUrl || '#'}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-xl bg-surface-800 text-surface-300 hover:text-primary-400 transition-colors"
      >
        <Download size={16} />
      </a>
    </Card>
  );
}
