import { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { talentService } from '@services/talent.service';
import { TalentCard } from '@components/talent/TalentCard';
import { InviteCandidateModal } from '@components/talent/InviteCandidateModal';

export function TalentDiscoveryPage() {
  const [workers, setWorkers] = useState([]);
  const [query, setQuery] = useState('');
  const [activeInviteUserId, setActiveInviteUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTalent() {
      try {
        const res = await talentService.searchTalent({ query });
        setWorkers(res.workers || []);
      } catch (err) {
        console.error('Failed to search talent', err);
      } finally {
        setLoading(false);
      }
    }
    loadTalent();
  }, [query]);

  const handleSendInvitation = async (data) => {
    try {
      await talentService.inviteCandidate(data);
      alert('Invitation sent successfully!');
    } catch (err) {
      console.error('Failed to send invitation', err);
    }
  };

  const handleAddToPool = async (workerUserId) => {
    try {
      const pools = await talentService.getTalentPools();
      if (pools.length === 0) {
        alert('Please create a Talent Pool first from the Talent Pools page.');
        return;
      }
      await talentService.addCandidateToPool(pools[0].id, workerUserId, 'Added from discovery search');
      alert(`Candidate added to pool "${pools[0].name}"!`);
    } catch (err) {
      console.error('Failed to save candidate to pool', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Users size={20} className="text-primary-600" />
          <span>Talent Discovery & Weighted Matching Engine</span>
        </h1>
        <p className="text-xs text-surface-600">
          Discover verified talent, evaluate weighted matching scores (0-100%), save to pools, and send job invitations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-600" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidates by title, skills, or experience..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-surface-200 text-xs text-surface-900 placeholder-surface-500 focus:outline-none focus:border-primary-600"
        />
      </div>

      {/* Talent Cards Grid */}
      {loading ? (
        <p className="text-xs text-surface-600">Searching candidate profiles...</p>
      ) : workers.length === 0 ? (
        <p className="text-xs text-surface-600">No candidates match your discovery criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <TalentCard
              key={worker.id}
              worker={worker}
              onInvite={(userId) => setActiveInviteUserId(userId)}
              onAddToPool={handleAddToPool}
            />
          ))}
        </div>
      )}

      <InviteCandidateModal
        isOpen={!!activeInviteUserId}
        onClose={() => setActiveInviteUserId(null)}
        workerUserId={activeInviteUserId}
        onSendInvitation={handleSendInvitation}
      />
    </div>
  );
}

