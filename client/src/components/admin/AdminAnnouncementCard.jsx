import { Megaphone } from 'lucide-react';

export function AdminAnnouncementCard({ announcement }) {
  if (!announcement) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase">Target: {announcement.targetRole || 'ALL'}</span>
        <span className="text-[10px] text-slate-400 font-mono">
          {new Date(announcement.createdAt || Date.now()).toLocaleDateString()}
        </span>
      </div>

      <h4 className="text-base font-bold text-white flex items-center gap-2">
        <Megaphone className="w-4 h-4 text-sky-400" />
        {announcement.title}
      </h4>

      <p className="text-xs text-slate-300 whitespace-pre-line">{announcement.message || announcement.content}</p>
    </div>
  );
}
