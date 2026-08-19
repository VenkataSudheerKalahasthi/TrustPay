import { useState } from 'react';
import { Paperclip, Plus, Download, FileText } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';

const categoryBadgeMap = {
  REQUIREMENT: { label: 'Requirement', variant: 'primary' },
  DESIGN: { label: 'Design', variant: 'secondary' },
  REFERENCE: { label: 'Reference', variant: 'neutral' },
  DELIVERABLE: { label: 'Deliverable', variant: 'success' },
  OTHER: { label: 'Other', variant: 'neutral' },
};

export function ProjectAttachments({ attachments = [], onUpload, isClientOwner, isWorkerAssigned }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filtered = selectedCategory === 'ALL'
    ? attachments
    : attachments.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-surface-900">Categorized Project Attachments</h3>
          <p className="text-xs text-surface-600">
            Requirements, design assets, reference materials, and project files
          </p>
        </div>
        {(isClientOwner || isWorkerAssigned) && (
          <Button size="sm" onClick={onUpload} leftIcon={<Plus size={14} />}>
            Add Attachment
          </Button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
        {['ALL', 'REQUIREMENT', 'DESIGN', 'REFERENCE', 'DELIVERABLE', 'OTHER'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary-500/20 text-primary-600 border border-primary-600/30'
                : 'text-surface-600 hover:text-surface-800 bg-surface-100/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center bg-card border-surface-200">
          <Paperclip className="w-8 h-8 text-surface-600 mx-auto mb-2" />
          <p className="text-xs text-surface-600">No attachments found in this category.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((att) => {
            const config = categoryBadgeMap[att.category] || categoryBadgeMap.OTHER;
            const uploaderName = att.uploadedByUser
              ? `${att.uploadedByUser.firstName} ${att.uploadedByUser.lastName}`
              : 'User';

            return (
              <Card key={att.id} className="p-4 bg-card border-surface-200 hover:border-surface-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-300 text-surface-700 shrink-0">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-semibold text-surface-900 truncate">{att.fileName}</h4>
                        <Badge variant={config.variant} size="xs">
                          {config.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-2xs text-surface-500">
                        <span>By {uploaderName}</span>
                        <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-surface-50 text-surface-700 hover:text-surface-900 hover:bg-surface-700 shrink-0"
                  >
                    <Download size={14} />
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

