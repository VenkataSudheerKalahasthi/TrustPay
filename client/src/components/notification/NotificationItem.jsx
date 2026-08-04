import { Link } from 'react-router-dom';
import {
  FolderOpen,
  FileText,
  Wallet,
  CreditCard,
  MessageSquare,
  User,
  Bell,
  CheckCircle,
  Archive,
  Trash2,
} from 'lucide-react';

const CATEGORY_ICONS = {
  PROJECT: FolderOpen,
  CONTRACT: FileText,
  ESCROW: Wallet,
  PAYMENT: CreditCard,
  INVOICE: CreditCard,
  MESSAGE: MessageSquare,
  PROFILE: User,
  SYSTEM: Bell,
};

export function NotificationItem({ notification, onMarkRead, onArchive, onDelete }) {
  if (!notification) return null;

  const Icon = CATEGORY_ICONS[notification.category] || Bell;
  const isUrgent = notification.priority === 'URGENT' || notification.priority === 'HIGH';

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex items-start gap-3 relative ${
        notification.isRead
          ? 'bg-surface-900/60 border-surface-800/80 opacity-80'
          : 'bg-surface-900 border-surface-700 shadow-sm'
      }`}
    >
      <div
        className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
          isUrgent
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-primary-500/10 border-primary-500/30 text-primary-400'
        }`}
      >
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-xs font-bold text-surface-100 truncate">{notification.title}</h4>
          <span className="text-3xs text-surface-400 shrink-0">
            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <p className="text-xs text-surface-300 line-clamp-2 leading-relaxed mb-2">
          {notification.message}
        </p>

        {notification.linkUrl && (
          <Link
            to={notification.linkUrl}
            className="text-2xs font-semibold text-primary-400 hover:text-primary-300 transition-colors inline-block mb-2"
          >
            View Details →
          </Link>
        )}

        <div className="flex items-center justify-between text-3xs text-surface-400 pt-2 border-t border-surface-800/60">
          <span className="font-mono uppercase font-semibold text-primary-400">
            {notification.category}
          </span>

          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                title="Mark Read"
              >
                <CheckCircle size={12} />
                <span>Mark Read</span>
              </button>
            )}

            {!notification.isArchived && (
              <button
                onClick={() => onArchive(notification.id)}
                className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                title="Archive"
              >
                <Archive size={12} />
                <span>Archive</span>
              </button>
            )}

            <button
              onClick={() => onDelete(notification.id)}
              className="hover:text-red-400 flex items-center gap-1 transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
