import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, Send, CheckCircle2 } from 'lucide-react';
import { marketplaceService } from '@services/marketplace.service';
import { JobStatusBadge } from '@components/marketplace/JobStatusBadge';
import { Button } from '@components/ui/Button';

export function JobDetailsPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proposal Submission State
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(1500);
  const [estimatedDays, setEstimatedDays] = useState(14);
  const [submittedProposal, setSubmittedProposal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await marketplaceService.getJobDetails(slug);
        setJob(res.job || null);
        if (res.job) {
          setBidAmount(res.job.budget || 1500);
        }
      } catch (err) {
        console.error('Failed to load job details', err);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [slug]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await marketplaceService.submitProposal({
        jobId: job.id,
        coverLetter,
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
      });
      setSubmittedProposal(res);
    } catch (err) {
      alert(err.message || 'Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-xs text-surface-400 p-4">Loading job details...</p>;
  if (!job) return <p className="text-xs text-red-400 p-4">Job opportunity not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
            <Briefcase size={20} className="text-primary-400" />
            <span>{job.title}</span>
          </h1>
          <p className="text-3xs font-mono text-surface-400">
            Posted by {job.clientUser?.firstName} {job.clientUser?.lastName} • Slug: {job.slug}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <JobStatusBadge status={job.status} />
          <Link
            to={`/dashboard/client/marketplace/${job.id}/pipeline`}
            className="px-3 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-xs font-bold text-surface-200 transition-colors"
          >
            Hiring Pipeline ({job.proposalCount || 0})
          </Link>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800 space-y-4">
        <h3 className="text-xs font-bold text-surface-200 uppercase tracking-wider">Opportunity Description</h3>
        <p className="text-xs text-surface-200 leading-relaxed whitespace-pre-line">{job.description}</p>
      </div>

      {/* Submit Proposal Composer */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800 space-y-4">
        <h3 className="text-xs font-bold text-surface-100 flex items-center gap-2">
          <Send size={16} className="text-primary-400" />
          <span>Submit Proposal</span>
        </h3>

        {submittedProposal ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs">
              <CheckCircle2 size={16} />
              <span>Proposal Submitted Successfully!</span>
            </div>
            <p className="text-3xs">Your proposal has been sent to the client. You will be notified when reviewed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div>
              <label className="text-3xs font-mono text-surface-400 block mb-1">Cover Letter *</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Explain why you are the best fit for this opportunity..."
                required
                className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-3xs font-mono text-surface-400 block mb-1">Bid Amount ($USD)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-3xs font-mono text-surface-400 block mb-1">Estimated Days to Complete</label>
                <input
                  type="number"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <Button size="sm" variant="primary" type="submit" isLoading={submitting}>
              Submit Formal Proposal
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
