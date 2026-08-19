import { Search, Plus, MessageSquare, Briefcase, FileText } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Avatar } from '@components/ui/Avatar';
import { OnlineIndicator } from './OnlineIndicator';
import { UnreadBadge } from './UnreadBadge';

export function ConversationList({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onOpenNewConversation,
  currentUserId,
  onlinePresences = {},
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="w-full md:w-80 lg:w-96 bg-card border-r border-surface-200 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-surface-200 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-surface-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary-600" />
            <span>Messages & Chat</span>
          </h2>

          <Button size="xs" onClick={onOpenNewConversation} leftIcon={<Plus size={14} />}>
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 placeholder-surface-500 focus:outline-none focus:border-primary-600"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-surface-800/60">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-surface-600">
            No active conversations.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const otherParticipant = conv.participants?.find((p) => p.userId !== currentUserId)?.user;
            const title =
              conv.type === 'DIRECT' && otherParticipant
                ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                : conv.title || conv.conversationNumber;

            const presence = otherParticipant ? onlinePresences[otherParticipant.id] || 'OFFLINE' : 'OFFLINE';
            const lastMessage = conv.messages && conv.messages[0];

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full p-4 flex items-start gap-3 text-left transition-colors relative ${
                  isActive ? 'bg-primary-50 border-l-4 border-primary-600' : 'hover:bg-surface-100/40'
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <Avatar name={title} src={otherParticipant?.avatar} size="sm" />
                  {conv.type === 'DIRECT' && (
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <OnlineIndicator status={presence} size="xs" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs font-semibold text-surface-900 truncate">{title}</h4>
                    {lastMessage && (
                      <span className="text-3xs text-surface-600 shrink-0">
                        {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-2xs text-surface-600 mb-1">
                    <span className="font-mono text-3xs font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.2 rounded">
                      {conv.conversationNumber}
                    </span>
                    {conv.project && (
                      <span className="truncate flex items-center gap-1 text-amber-400">
                        <Briefcase size={10} />
                        {conv.project.title}
                      </span>
                    )}
                    {conv.contract && (
                      <span className="truncate flex items-center gap-1 text-emerald-400">
                        <FileText size={10} />
                        #{conv.contract.contractNumber}
                      </span>
                    )}
                  </div>

                  {lastMessage && (
                    <p className="text-xs text-surface-600 truncate leading-relaxed">
                      {lastMessage.content}
                    </p>
                  )}
                </div>

                {conv.unreadCount > 0 && (
                  <div className="shrink-0 mt-1">
                    <UnreadBadge count={conv.unreadCount} />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

