import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { VerificationReviewCard } from '@components/admin/VerificationReviewCard';
import { VerificationReviewModal } from '@components/admin/VerificationReviewModal';
import { ShieldCheck } from 'lucide-react';

export function VerificationCenterPage() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, _setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getVerificationReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.reviewVerification(id, { status: 'VERIFIED', notes: 'Approved by admin' });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleReject = async (id) => {
    const notes = prompt('Enter rejection notes for user:');
    if (notes) {
      try {
        await adminService.reviewVerification(id, { status: 'REJECTED', notes });
        fetchReviews();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Verification Center & Identity Review Queue
        </h1>
        <p className="text-slate-400 text-sm">Worker & client identity document verification, KYC review, and approval status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <ShieldCheck className="w-10 h-10 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No pending verification reviews</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <VerificationReviewCard
              key={rev.id}
              review={rev}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>

      <VerificationReviewModal
        isOpen={isModalOpen}
        review={selectedReview}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </div>
  );
}
