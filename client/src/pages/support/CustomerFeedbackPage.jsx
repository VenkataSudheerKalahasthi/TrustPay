import { useState, useEffect } from 'react';
import { supportService } from '@services/support.service';
import { FeedbackDialog } from '@components/support/FeedbackDialog';
import { Star, Plus } from 'lucide-react';

export function CustomerFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await supportService.getFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            Customer Feedback & CSAT Hub
          </h1>
          <p className="text-slate-400 text-sm">Review platform feedback ratings, service quality reviews, and feature requests</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Give Feedback
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
            <tr>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Summary & Comments</th>
              <th className="py-3.5 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                  No feedback ratings recorded
                </td>
              </tr>
            ) : (
              feedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {fb.user?.firstName} {fb.user?.lastName}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-bold text-sky-400">{fb.type}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{fb.rating} ★</td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-bold text-white block">{fb.title}</span>
                    <span className="text-slate-400">{fb.comment}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <FeedbackDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchFeedbacks}
      />
    </div>
  );
}
