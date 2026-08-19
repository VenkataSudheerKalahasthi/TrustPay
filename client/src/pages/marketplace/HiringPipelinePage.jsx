import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, CheckCircle, ShieldCheck } from 'lucide-react';
import { marketplaceService } from '@services/marketplace.service';
import { HiringPipelineBar } from '@components/marketplace/HiringPipelineBar';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

export function HiringPipelinePage() {
  const { jobId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    async function loadProposals() {
      try {
        const res = await marketplaceService.getJobProposals(jobId);
        setProposals(res.proposals || []);
      } catch (err) {
        console.error('Failed to load proposals', err);
      } finally {
        setLoading(false);
      }
    }
    loadProposals();
  }, [jobId]);

  const handleUpdateStatus = async (proposalId, status, version) => {
    try {
      const updated = await marketplaceService.updateProposalStatus(proposalId, status, version);
      setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, ...updated } : p)));
    } catch (err) {
      alert(err.message || 'Version Conflict or invalid status transition.');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      const res = await marketplaceService.acceptOffer(offerId || 'mock_offer_id');
      setActionMessage(res.message);
    } catch (err) {
      console.error('Failed to accept offer', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Users size={20} className="text-primary-600" />
          <span>Candidate Evaluation & Hiring Pipeline</span>
        </h1>
        <p className="text-xs text-surface-600">
          Evaluate applicants, advance candidate stages, send formal offers, and transition to Escrow contracts.
        </p>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 font-bold text-xs">
          <CheckCircle size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-surface-600">Loading candidate proposals...</p>
      ) : proposals.length === 0 ? (
        <p className="text-xs text-surface-600">No proposals submitted for this job yet.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <Card key={p.id} className="p-5 bg-card border-surface-200 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 font-bold flex items-center justify-center">
                    {p.workerUser?.firstName?.[0] || 'W'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-surface-900">
                      {p.workerUser?.firstName} {p.workerUser?.lastName}
                    </h4>
                    <span className="text-3xs font-mono text-surface-600">
                      Bid: <strong className="text-emerald-400">${p.bidAmount}</strong> • Estimated Time: {p.estimatedDays} Days
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="xs" variant="outline" onClick={() => handleUpdateStatus(p.id, 'SHORTLISTED', p.version)}>
                    Shortlist Candidate
                  </Button>
                  <Button size="xs" variant="primary" onClick={() => handleAcceptOffer(p.id)}>
                    Hire Candidate
                  </Button>
                </div>
              </div>

              <HiringPipelineBar currentStage={p.status} />

              <div className="p-3 rounded-xl bg-card/60 text-xs text-surface-700">
                <p className="font-semibold text-surface-800 mb-1">Cover Letter:</p>
                <p className="text-3xs line-clamp-3">{p.coverLetter}</p>
              </div>

              {p.isFrozen && (
                <span className="inline-flex items-center gap-1 text-3xs font-mono text-amber-400 font-bold">
                  <ShieldCheck size={12} />
                  <span>Proposal Frozen (Immutable Bid & Milestones)</span>
                </span>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

