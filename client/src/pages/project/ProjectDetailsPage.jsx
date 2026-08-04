import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Wallet,
  User,
  RefreshCw,
  Clock,
  Layers,
  FileCheck,
  Shield,
  Paperclip,
} from 'lucide-react';
import { projectService } from '@services/project.service';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { ProjectStatusBadge } from '@components/project/ProjectStatusBadge';
import { ProjectProgressCard } from '@components/project/ProjectProgressCard';
import { MilestoneList } from '@components/project/MilestoneList';
import { MilestoneModal } from '@components/project/MilestoneModal';
import { DeliverableList } from '@components/project/DeliverableList';
import { DeliverableModal } from '@components/project/DeliverableModal';
import { DeliverableSubmitModal } from '@components/project/DeliverableSubmitModal';
import { DeliverableReviewModal } from '@components/project/DeliverableReviewModal';
import { DeliverableHistoryModal } from '@components/project/DeliverableHistoryModal';
import { EvidenceGrid } from '@components/project/EvidenceGrid';
import { EvidenceUploadModal } from '@components/project/EvidenceUploadModal';
import { ProjectStatusModal } from '@components/project/ProjectStatusModal';
import { ProjectAttachments } from '@components/project/ProjectAttachments';
import { ProjectTimeline } from '@components/project/ProjectTimeline';

export function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('milestones');

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [submitModalDeliverable, setSubmitModalDeliverable] = useState(null);
  const [reviewModalDeliverable, setReviewModalDeliverable] = useState(null);
  const [reviewTargetStatus, setReviewTargetStatus] = useState('APPROVED');
  const [historyModalDeliverable, setHistoryModalDeliverable] = useState(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  const fetchProjectDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectById(id);
      setProject(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="h-24 bg-surface-900 border border-surface-800 rounded-2xl animate-pulse" />
        <div className="h-64 bg-surface-900 border border-surface-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-surface-900 border border-red-500/30 text-center space-y-4">
        <p className="text-xs text-red-400">{error || 'Project not found'}</p>
        <Button size="sm" variant="secondary" onClick={fetchProjectDetails} leftIcon={<RefreshCw size={14} />}>
          Retry
        </Button>
      </div>
    );
  }

  const isClientOwner = user?.role === 'ADMIN' || project.clientProfile?.userId === user?.id || project.createdById === user?.id;
  const isWorkerAssigned = project.workerProfile?.userId === user?.id;

  const clientName = project.clientProfile?.user
    ? `${project.clientProfile.user.firstName} ${project.clientProfile.user.lastName}`
    : 'Client';
  const workerName = project.workerProfile?.user
    ? `${project.workerProfile.user.firstName} ${project.workerProfile.user.lastName}`
    : 'Unassigned';

  const handleStatusChange = async (targetStatus, reason) => {
    await projectService.updateProjectStatus(project.id, targetStatus, reason);
    await fetchProjectDetails();
  };

  const handleAddMilestone = async (data) => {
    await projectService.addMilestone(project.id, data);
    await fetchProjectDetails();
  };

  const handleMilestoneStatusChange = async (milestoneId, status) => {
    await projectService.updateMilestone(project.id, milestoneId, { status });
    await fetchProjectDetails();
  };

  const handleAddDeliverable = async (data) => {
    await projectService.addDeliverable(project.id, data);
    await fetchProjectDetails();
  };

  const handleSubmitDeliverableVersion = async (deliverableId, data) => {
    await projectService.submitDeliverable(project.id, deliverableId, data);
    await fetchProjectDetails();
  };

  const handleReviewDeliverable = async (deliverableId, data) => {
    await projectService.reviewDeliverable(project.id, deliverableId, data);
    await fetchProjectDetails();
  };

  const handleUploadEvidence = async (data) => {
    await projectService.uploadEvidence(project.id, data);
    await fetchProjectDetails();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/projects">
          <Button size="xs" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
            Back to Projects List
          </Button>
        </Link>

        {(isClientOwner || isWorkerAssigned) && (
          <Button size="xs" variant="secondary" onClick={() => setStatusModalOpen(true)}>
            Change Status ({project.status})
          </Button>
        )}
      </div>

      <Card className="p-6 bg-surface-900 border-surface-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-lg border border-primary-500/20">
                {project.projectNumber}
              </span>
              <ProjectStatusBadge status={project.status} />
              {project.category && (
                <span className="text-2xs text-surface-400 bg-surface-800 px-2 py-0.5 rounded-md">
                  {project.category}
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-surface-50">{project.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {project.contract && (
              <Link to={`/contracts/${project.contract.id}`}>
                <Button size="xs" variant="ghost" leftIcon={<ShieldCheck size={14} className="text-emerald-400" />}>
                  Contract #{project.contract.contractNumber}
                </Button>
              </Link>
            )}

            {project.escrowWallet && (
              <Link to="/wallet">
                <Button size="xs" variant="ghost" leftIcon={<Wallet size={14} className="text-indigo-400" />}>
                  Escrow Wallet
                </Button>
              </Link>
            )}
          </div>
        </div>

        {project.description && (
          <p className="text-xs text-surface-300 leading-relaxed max-w-4xl">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-800 text-xs">
          <div className="flex items-center gap-2 text-surface-300">
            <User size={14} className="text-surface-500" />
            <div>
              <span className="text-surface-500 block text-2xs">Client</span>
              <span className="font-semibold text-surface-100">{clientName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-surface-300">
            <User size={14} className="text-surface-500" />
            <div>
              <span className="text-surface-500 block text-2xs">Assigned Worker</span>
              <span className="font-semibold text-surface-100">{workerName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-surface-300">
            <Calendar size={14} className="text-surface-500" />
            <div>
              <span className="text-surface-500 block text-2xs">Start Date</span>
              <span className="font-semibold text-surface-100">
                {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-surface-300">
            <Calendar size={14} className="text-surface-500" />
            <div>
              <span className="text-surface-500 block text-2xs">Estimated Budget</span>
              <span className="font-semibold text-surface-100">
                {project.estimatedBudget ? `₹${project.estimatedBudget.toLocaleString()}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <ProjectProgressCard metrics={project.progressMetrics} />

      <div className="flex items-center gap-2 border-b border-surface-800 overflow-x-auto scrollbar-hide text-xs">
        {[
          { id: 'milestones', label: 'Milestones & Dependencies', icon: Layers },
          { id: 'deliverables', label: 'Deliverables & Versions', icon: FileCheck },
          { id: 'evidence', label: 'Evidence Vault (SHA-256)', icon: Shield },
          { id: 'attachments', label: 'Attachments Repository', icon: Paperclip },
          { id: 'timeline', label: 'Timeline & Audit Log', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-400 bg-surface-900/50'
                  : 'border-transparent text-surface-400 hover:text-surface-200'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'milestones' && (
          <MilestoneList
            milestones={project.milestones || []}
            onAdd={() => setMilestoneModalOpen(true)}
            onUpdateStatus={handleMilestoneStatusChange}
            isClientOwner={isClientOwner}
            isWorkerAssigned={isWorkerAssigned}
          />
        )}

        {activeTab === 'deliverables' && (
          <DeliverableList
            deliverables={project.deliverables || []}
            onAdd={() => setDeliverableModalOpen(true)}
            onSubmitVersion={(d) => setSubmitModalDeliverable(d)}
            onReview={(d, status) => {
              setReviewModalDeliverable(d);
              setReviewTargetStatus(status);
            }}
            onViewHistory={(d) => setHistoryModalDeliverable(d)}
            isClientOwner={isClientOwner}
            isWorkerAssigned={isWorkerAssigned}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceGrid
            evidenceList={project.evidenceList || []}
            onUpload={() => setEvidenceModalOpen(true)}
            isClientOwner={isClientOwner}
            isWorkerAssigned={isWorkerAssigned}
          />
        )}

        {activeTab === 'attachments' && (
          <ProjectAttachments
            attachments={project.attachments || []}
            onUpload={() => {}}
            isClientOwner={isClientOwner}
            isWorkerAssigned={isWorkerAssigned}
          />
        )}

        {activeTab === 'timeline' && (
          <Card className="p-6 bg-surface-900 border-surface-800">
            <h3 className="text-sm font-semibold text-surface-100 mb-4">Project Chronological Timeline</h3>
            <ProjectTimeline events={project.timelines || []} />
          </Card>
        )}
      </div>

      <ProjectStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onSubmit={handleStatusChange}
        currentStatus={project.status}
      />

      <MilestoneModal
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        onSubmit={handleAddMilestone}
        existingMilestones={project.milestones || []}
      />

      <DeliverableModal
        isOpen={deliverableModalOpen}
        onClose={() => setDeliverableModalOpen(false)}
        onSubmit={handleAddDeliverable}
        milestones={project.milestones || []}
      />

      <DeliverableSubmitModal
        isOpen={!!submitModalDeliverable}
        onClose={() => setSubmitModalDeliverable(null)}
        onSubmit={handleSubmitDeliverableVersion}
        deliverable={submitModalDeliverable}
      />

      <DeliverableReviewModal
        isOpen={!!reviewModalDeliverable}
        onClose={() => setReviewModalDeliverable(null)}
        onSubmit={handleReviewDeliverable}
        deliverable={reviewModalDeliverable}
        targetStatus={reviewTargetStatus}
      />

      <DeliverableHistoryModal
        isOpen={!!historyModalDeliverable}
        onClose={() => setHistoryModalDeliverable(null)}
        deliverable={historyModalDeliverable}
      />

      <EvidenceUploadModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        onSubmit={handleUploadEvidence}
        milestones={project.milestones || []}
        deliverables={project.deliverables || []}
      />
    </div>
  );
}
