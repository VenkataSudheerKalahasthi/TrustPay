import { useState } from 'react';
import { Check, CheckCheck, Clock, History, Reply, Edit2, Trash2, ShieldCheck, Smile } from 'lucide-react';
import { Avatar } from '@components/ui/Avatar';

const EMOJI_OPTIONS = ['👍', '❤️', '🔥', '🎉', '🚀', '👀'];

export function MessageItem({
  message,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onToggleReaction,
  onViewHistory,
  onPreviewAttachment,
}) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!message) return null;

  const isSelf = message.senderUserId === currentUserId;
  const senderName = message.senderUser
    ? `${message.senderUser.firstName} ${message.senderUser.lastName}`
    : 'User';

  const deliveryStatus = message.deliveryStatus || 'SENT';

  return (
    <div
      className={`group relative flex gap-3 px-4 py-2 hover:bg-card/40 transition-colors ${
        isSelf ? 'flex-row-reverse' : 'flex-row'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {/* Sender Avatar */}
      <Avatar name={senderName} src={message.senderUser?.avatar} size="sm" className="shrink-0 mt-0.5" />

      {/* Message Bubble Container */}
      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isSelf ? 'items-end' : 'items-start'}`}>
        {/* Sender Name Header */}
        <div className="flex items-center gap-2 mb-1 text-2xs text-surface-600">
          <span className="font-semibold text-surface-800">{senderName}</span>
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.isEdited && (
            <button
              onClick={() => onViewHistory(message)}
              className="text-primary-600 hover:underline flex items-center gap-0.5"
            >
              (edited <History size={10} />)
            </button>
          )}
        </div>

        {/* Parent Message Reply Preview */}
        {message.parentMessage && (
          <div className="mb-1.5 p-2 rounded-lg bg-surface-100/80 border-l-2 border-primary-600 text-2xs text-surface-700 w-full truncate">
            <span className="font-semibold text-primary-600 block mb-0.5">
              Replying to {message.parentMessage.senderUser?.firstName}:
            </span>
            <span className="truncate block">{message.parentMessage.content}</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`p-3 rounded-2xl text-xs leading-relaxed break-words shadow-sm relative ${
            isSelf
              ? 'bg-primary-600 text-white rounded-tr-none'
              : 'bg-surface-50 text-surface-900 rounded-tl-none border border-surface-300/60'
          }`}
        >
          {message.content}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-surface-300/40 space-y-1.5 w-full">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  onClick={() => onPreviewAttachment(att)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-card/60 hover:bg-card text-surface-800 hover:text-white cursor-pointer transition-colors text-2xs"
                >
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate flex-1 font-mono">{att.fileName}</span>
                  {att.sha256Hash && <span className="text-3xs text-emerald-400 font-mono">[SHA-256]</span>}
                </div>
              ))}
            </div>
          )}

          {/* Message Status Icon for Self */}
          {isSelf && (
            <div className="flex items-center justify-end mt-1 text-2xs opacity-80 gap-1">
              {deliveryStatus === 'SENDING' && <Clock size={10} className="animate-spin" />}
              {deliveryStatus === 'SENT' && <Check size={12} />}
              {deliveryStatus === 'DELIVERED' && <CheckCheck size={12} className="text-surface-700" />}
              {deliveryStatus === 'READ' && <CheckCheck size={12} className="text-emerald-300 font-bold" />}
            </div>
          )}
        </div>

        {/* Emoji Reactions Pill */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {message.reactions.map((r) => (
              <button
                key={r.id}
                onClick={() => onToggleReaction(message.id, r.emoji)}
                className="px-2 py-0.5 rounded-full bg-surface-50 border border-surface-300 text-2xs flex items-center gap-1 hover:bg-surface-700 transition-colors"
              >
                <span>{r.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Menu on Hover */}
      {showActions && (
        <div
          className={`absolute top-2 z-10 flex items-center gap-1 bg-surface-50 border border-surface-300 rounded-xl p-1 shadow-xl ${
            isSelf ? 'right-20' : 'left-20'
          }`}
        >
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1 rounded-lg text-surface-600 hover:text-amber-400 hover:bg-surface-700"
            title="Add Reaction"
          >
            <Smile size={14} />
          </button>

          <button
            onClick={() => onReply(message)}
            className="p-1 rounded-lg text-surface-600 hover:text-primary-600 hover:bg-surface-700"
            title="Reply"
          >
            <Reply size={14} />
          </button>

          {isSelf && !message.isDeleted && (
            <>
              <button
                onClick={() => onEdit(message)}
                className="p-1 rounded-lg text-surface-600 hover:text-indigo-400 hover:bg-surface-700"
                title="Edit Message"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(message)}
                className="p-1 rounded-lg text-surface-600 hover:text-red-400 hover:bg-surface-700"
                title="Delete Message"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}

          {/* Quick Emoji Bar */}
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 left-0 bg-card border border-surface-300 rounded-xl p-1.5 flex gap-1 shadow-2xl z-20">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    onToggleReaction(message.id, e);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1 hover:bg-surface-50 rounded text-sm transition-transform hover:scale-125"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

