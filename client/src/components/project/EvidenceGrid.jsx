import { ShieldCheck, Plus, FileText, Image, Video, FileArchive, Link as LinkIcon, Download } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

const evidenceIconMap = {
  IMAGE: Image,
  VIDEO: Video,
  PDF: FileText,
  ZIP: FileArchive,
  DOCUMENT: FileText,
  LINK: LinkIcon,
  OTHER: FileText,
};

export function EvidenceGrid({ evidenceList = [], onUpload, isClientOwner, isWorkerAssigned }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-100">Work Evidence Vault (SHA-256)</h3>
          <p className="text-xs text-surface-400">
            Cryptographic file hash verification & permanent work evidence records
          </p>
        </div>
        {(isClientOwner || isWorkerAssigned) && (
          <Button size="sm" onClick={onUpload} leftIcon={<Plus size={14} />}>
            Upload Evidence
          </Button>
        )}
      </div>

      {evidenceList.length === 0 ? (
        <Card className="p-8 text-center bg-surface-900 border-surface-800">
          <ShieldCheck className="w-8 h-8 text-surface-600 mx-auto mb-2" />
          <p className="text-xs text-surface-400">No cryptographic work evidence uploaded yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {evidenceList.map((item) => {
            const IconComp = evidenceIconMap[item.evidenceType] || FileText;
            const uploaderName = item.uploadedByUser
              ? `${item.uploadedByUser.firstName} ${item.uploadedByUser.lastName}`
              : 'User';

            return (
              <Card key={item.id} className="p-4 bg-surface-900 border-surface-800 hover:border-surface-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-surface-800 border border-surface-700 text-primary-400 shrink-0">
                    <IconComp size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-surface-100 truncate">{item.title}</h4>
                      <a
                        href={item.fileUrl || item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-surface-400 hover:text-surface-100 p-1"
                      >
                        <Download size={14} />
                      </a>
                    </div>

                    {item.description && (
                      <p className="text-2xs text-surface-400 line-clamp-2 mb-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.sha256Hash && (
                      <div className="p-1.5 rounded-lg bg-surface-950/60 border border-surface-800 font-mono text-2xs text-surface-400 truncate mb-2">
                        <span className="text-emerald-400 font-semibold mr-1">SHA-256:</span>
                        <span className="text-surface-300">{item.sha256Hash}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-2xs text-surface-500 pt-2 border-t border-surface-800/60">
                      <span>By {uploaderName}</span>
                      <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
