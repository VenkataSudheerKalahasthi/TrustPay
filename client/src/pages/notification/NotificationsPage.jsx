import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Archive, RefreshCw } from 'lucide-react';
import { notificationService } from '@services/notification.service';
import { Button } from '@components/ui/Button';
import { NotificationItem } from '@components/notification/NotificationItem';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, unreadCount: 0 });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getUserNotifications({
        category: selectedCategory || undefined,
        isArchived,
        page,
        limit: 15,
      });
      setNotifications(data.notifications || []);
      setPagination({ total: data.total, unreadCount: data.unreadCount });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, isArchived, page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleArchive = async (id) => {
    await notificationService.bulkArchive(id);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await notificationService.deleteNotification(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await notificationService.bulkMarkAsRead(selectedCategory || null);
    fetchNotifications();
  };

  const handleArchiveAll = async () => {
    await notificationService.bulkArchive(selectedCategory || null);
    fetchNotifications();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            <Bell size={20} className="text-primary-600" />
            <span>Notification Hub</span>
          </h1>
          <p className="text-xs text-surface-600">
            Realtime alerts, project updates, contract signatures, and escrow payment notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pagination.unreadCount > 0 && (
            <Button size="xs" variant="secondary" onClick={handleMarkAllRead} leftIcon={<CheckCheck size={14} />}>
              Mark All Read
            </Button>
          )}
          <Button size="xs" variant="ghost" onClick={handleArchiveAll} leftIcon={<Archive size={14} />}>
            Archive All
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-card border border-surface-200 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-hide text-xs">
          {[
            { id: '', label: 'All' },
            { id: 'PROJECT', label: 'Projects' },
            { id: 'CONTRACT', label: 'Contracts' },
            { id: 'ESCROW', label: 'Escrow' },
            { id: 'MESSAGE', label: 'Messages' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white shadow'
                  : 'bg-surface-50 text-surface-600 hover:text-surface-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsArchived(!isArchived)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
            isArchived
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'border-surface-300 bg-surface-50 text-surface-600 hover:text-surface-800'
          }`}
        >
          {isArchived ? 'Viewing Archived' : 'View Archive'}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-card border border-surface-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-card border border-red-500/30 text-center">
          <p className="text-xs text-red-400 mb-3">{error}</p>
          <Button size="sm" variant="secondary" onClick={fetchNotifications} leftIcon={<RefreshCw size={14} />}>
            Retry
          </Button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-surface-200">
          <Bell className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-surface-800">No Notifications</h3>
          <p className="text-xs text-surface-600 max-w-xs mx-auto mt-1">
            You don't have any {isArchived ? 'archived' : 'active'} notifications in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

