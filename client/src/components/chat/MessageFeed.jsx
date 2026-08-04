import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { MessageSquare } from 'lucide-react';

export function MessageFeed({
  messages = [],
  currentUserId,
  typingUsers = {},
  onReply,
  onEdit,
  onDelete,
  onToggleReaction,
  onViewHistory,
  onPreviewAttachment,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-950/40">
        <MessageSquare className="w-12 h-12 text-surface-600 mb-3" />
        <h4 className="text-sm font-semibold text-surface-200">No Messages Yet</h4>
        <p className="text-xs text-surface-400 max-w-xs mt-1">
          Start the conversation by typing a message below.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-1 py-4 bg-surface-950/30 scrollbar-thin">
      {messages.map((m) => (
        <MessageItem
          key={m.id}
          message={m}
          currentUserId={currentUserId}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleReaction={onToggleReaction}
          onViewHistory={onViewHistory}
          onPreviewAttachment={onPreviewAttachment}
        />
      ))}

      <TypingIndicator typingUsers={typingUsers} />
      <div ref={bottomRef} />
    </div>
  );
}
