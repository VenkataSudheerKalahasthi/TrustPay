import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { AdminAnnouncementCard } from '@components/admin/AdminAnnouncementCard';
import { CreateAnnouncementModal } from '@components/admin/CreateAnnouncementModal';
import { Megaphone, Plus } from 'lucide-react';

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnnouncements();
      setAnnouncements(data.announcements || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-sky-400" />
            Administrative Announcements & Operational Banners
          </h1>
          <p className="text-slate-400 text-sm">System broadcasts, platform notices, and targeted role announcements</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((anc) => (
          <AdminAnnouncementCard key={anc.id} announcement={anc} />
        ))}
      </div>

      <CreateAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAnnouncements}
      />
    </div>
  );
}
