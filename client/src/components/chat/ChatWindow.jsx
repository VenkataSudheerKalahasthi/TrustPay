import { useState, useEffect } from 'react';
import { MessageSquare, Briefcase, FileText, Wifi, WifiOff } from 'lucide-react';
import { Avatar } from '@components/ui/Avatar';
import { OnlineIndicator } from './OnlineIndicator';
import { MessageFeed } from './MessageFeed';
import { MessageComposer } from './MessageComposer';
import { MessageHistoryModal } from './MessageHistoryModal';
import { AttachmentPreviewModal } from './AttachmentPreviewModal';

export function ChatWindow({
  conversation,
  messages = [],
  currentUserId,
  connected,
  typingUsers = {},
  onlinePresences = {},
  onSendMessage,
  onTyping,
  onUpdateMessage,
  onDeleteMessage,
  onToggleReaction,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [historyModalMessage, setHistoryModalMessage] = useState(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);

  useEffect(() => {
    setReplyingTo(null);
    setEditingMessage(null);
  }, [conversation?.id]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card/40">
        <MessageSquare className="w-16 h-16 text-surface-600 mb-4" />
        <h3 className="text-base font-bold text-surface-800">No Conversation Selected</h3>
        <p className="text-xs text-surface-600 max-w-sm mt-1">
          Select a conversation from the sidebar or click "New" to start a direct message or project discussion.
        </p>
      </div>
    );
  }

  const otherParticipant = conversation.participants?.find((p) => p.userId !== currentUserId)?.user;
  const title =
    conversation.type === 'DIRECT' && otherParticipant
      ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
      : conversation.title || conversation.conversationNumber;

  const presence = otherParticipant ? onlinePresences[otherParticipant.id] || 'OFFLINE' : 'OFFLINE';

  return (
    <div className="flex-1 flex flex-col h-full bg-card/20 relative min-w-0">
      {/* Header */}
      <div className="p-4 bg-card border-b border-surface-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar name={title} src={otherParticipant?.avatar} size="sm" />
            {conversation.type === 'DIRECT' && (
              <div className="absolute -bottom-0.5 -right-0.5">
                <OnlineIndicator status={presence} size="xs" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-surface-900 truncate">{title}</h3>
              <span className="text-3xs font-mono font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                {conversation.conversationNumber}
              </span>
            </div>

            <div className="flex items-center gap-3 text-2xs text-surface-600 mt-0.5">
              {conversation.project && (
                <span className="flex items-center gap-1 text-amber-400 truncate">
                  <Briefcase size={12} />
                  Project: {conversation.project.title}
                </span>
              )}
              {conversation.contract && (
                <span className="flex items-center gap-1 text-emerald-400 truncate">
                  <FileText size={12} />
                  Contract #{conversation.contract.contractNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Realtime Socket Connection Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-2xs font-semibold border ${
              connected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{connected ? 'Realtime Socket Connected' : 'Connecting Socket...'}</span>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <MessageFeed
        messages={messages}
        currentUserId={currentUserId}
        typingUsers={typingUsers}
        onReply={(m) => setReplyingTo(m)}
        onEdit={(m) => setEditingMessage(m)}
        onDelete={(m) => onDeleteMessage(m.id)}
        onToggleReaction={onToggleReaction}
        onViewHistory={(m) => setHistoryModalMessage(m)}
        onPreviewAttachment={(att) => setPreviewAttachment(att)}
      />

      {/* Message Composer */}
      <MessageComposer
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        replyingTo={replyingTo}
        onClearReply={() => setReplyingTo(null)}
        editingMessage={editingMessage}
        onClearEdit={() => setEditingMessage(null)}
        onUpdateMessage={onUpdateMessage}
      />

      {/* Modals */}
      <MessageHistoryModal
        isOpen={!!historyModalMessage}
        onClose={() => setHistoryModalMessage(null)}
        message={historyModalMessage}
      />

      <AttachmentPreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
      />
    </div>
  );
}

