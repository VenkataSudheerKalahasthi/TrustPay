import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import { notificationService } from '@services/notification.service';
import { NotificationBadge } from './NotificationBadge';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications({ limit: 5 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load dropdown notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.bulkMarkAsRead();
    await fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
        className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors relative"
        title="Notifications"
      >
        <Bell size={18} />
        <div className="absolute -top-1 -right-1">
          <NotificationBadge count={unreadCount} />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-900 border border-surface-800 shadow-2xl z-dropdown overflow-hidden flex flex-col max-h-[32rem]">
          <div className="p-3 border-b border-surface-800 flex items-center justify-between bg-surface-900/80">
            <h4 className="text-xs font-bold text-surface-100 flex items-center gap-2">
              <Bell size={14} className="text-primary-400" />
              <span>Notifications</span>
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-3xs text-primary-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <CheckCheck size={12} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-surface-800/60">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-surface-400">No notifications.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`p-3 text-xs ${n.isRead ? 'opacity-70' : 'bg-surface-850'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-surface-100 truncate">{n.title}</span>
                    <span className="text-3xs text-surface-400 shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-2xs text-surface-300 line-clamp-2 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-surface-800 bg-surface-950 text-center">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center justify-center gap-1"
            >
              <span>View Notification Hub</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
