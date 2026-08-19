import { useState, useEffect } from 'react';
import { FileCheck, Download, Plus } from 'lucide-react';
import { operationService } from '@services/operation.service';
import { ComplianceReportCard } from '@components/operation/ComplianceReportCard';
import { Button } from '@components/ui/Button';

export function CompliancePage() {
  const [reports, setReports] = useState([]);
  const [exportRequests, setExportRequests] = useState([]);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    async function loadComplianceData() {
      try {
        const [reportsRes, exportsRes] = await Promise.all([
          operationService.getComplianceReports(),
          operationService.getExportRequests(),
        ]);
        setReports(reportsRes.reports || []);
        setExportRequests(exportsRes.exportRequests || []);
      } catch (err) {
        console.error('Failed to load compliance data', err);
      }
    }
    loadComplianceData();
  }, []);

  const handleRequestExport = async () => {
    setRequesting(true);
    try {
      const created = await operationService.createExportRequest();
      setExportRequests((prev) => [created, ...prev]);
      alert('GDPR data export request submitted and generated!');
    } catch (err) {
      console.error('Failed to create export request', err);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            <FileCheck size={20} className="text-primary-600" />
            <span>Compliance & GDPR Data Export Suite</span>
          </h1>
          <p className="text-xs text-surface-600">
            Submit data export requests, download audit logs, and enforce retention policies.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleRequestExport} isLoading={requesting} leftIcon={<Plus size={14} />}>
          Request Data Export
        </Button>
      </div>

      {/* Export Requests History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider">My GDPR Data Export History</h3>
        <div className="space-y-2">
          {exportRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-2xl bg-card border border-surface-200 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-surface-900">Data Export Package (#{req.id.substring(0, 8)})</span>
                <span className="block text-3xs font-mono text-surface-600">Requested: {new Date(req.requestedAt).toLocaleString()}</span>
              </div>

              {req.downloadUrl && (
                <a href={req.downloadUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-surface-50 text-primary-600 hover:bg-surface-700 transition-colors">
                  <Download size={16} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Reports */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider">System Compliance Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <ComplianceReportCard key={r.id} report={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

