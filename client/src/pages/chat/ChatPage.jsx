import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatService } from '@services/chat.service';
import { useAuth } from '@hooks/useAuth';
import { useChatSocket } from '@hooks/useChatSocket';
import { ConversationList } from '@components/chat/ConversationList';
import { ChatWindow } from '@components/chat/ChatWindow';
import { NewConversationModal } from '@components/chat/NewConversationModal';

export function ChatPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get('cid');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);

  const conversationId = activeConversation?.id || initialConvId || null;

  const { connected, typingUsers, onlinePresences, sendMessage: socketSendMessage, startTyping } =
    useChatSocket(conversationId);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getUserConversations({ q: searchQuery });
      setConversations(data.conversations || []);

      if (initialConvId && !activeConversation) {
        const found = (data.conversations || []).find((c) => c.id === initialConvId);
        if (found) setActiveConversation(found);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, initialConvId, activeConversation]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const fetchMessages = useCallback(async (cId) => {
    try {
      const data = await chatService.getConversationById(cId);
      setMessages(data.messages || []);
      await chatService.markAsRead(cId);
    } catch (err) {
      console.error('Failed to load conversation messages', err);
    }
  }, []);

  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation?.id, fetchMessages]);

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
  };

  const handleSendMessage = async (payload) => {
    if (!activeConversation) return;

    try {
      if (connected) {
        const sent = await socketSendMessage({
          conversationId: activeConversation.id,
          ...payload,
        });
        setMessages((prev) => [...prev, sent]);
      } else {
        const sent = await chatService.sendMessage({
          conversationId: activeConversation.id,
          ...payload,
        });
        setMessages((prev) => [...prev, sent]);
      }
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleUpdateMessage = async (messageId, content) => {
    try {
      const updated = await chatService.editMessage(messageId, { content });
      setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
    } catch (err) {
      console.error('Failed to edit message', err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const deleted = await chatService.deleteMessage(messageId);
      setMessages((prev) => prev.map((m) => (m.id === messageId ? deleted : m)));
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const handleToggleReaction = async (messageId, emoji) => {
    try {
      await chatService.toggleReaction(messageId, emoji);
      if (activeConversation?.id) {
        fetchMessages(activeConversation.id);
      }
    } catch (err) {
      console.error('Failed to toggle reaction', err);
    }
  };

  const handleCreateNewConversation = async (data) => {
    setSubmittingNew(true);
    try {
      const created = await chatService.createConversation(data);
      setNewModalOpen(false);
      await fetchConversations();
      setActiveConversation(created);
    } catch (err) {
      console.error('Failed to create new conversation', err);
    } finally {
      setSubmittingNew(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-6rem)] max-w-7xl mx-auto flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] max-w-7xl mx-auto flex bg-card border border-surface-200 rounded-2xl overflow-hidden shadow-2xl">
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={handleSelectConversation}
        onOpenNewConversation={() => setNewModalOpen(true)}
        currentUserId={user?.id}
        onlinePresences={onlinePresences}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ChatWindow
        conversation={activeConversation}
        messages={messages}
        currentUserId={user?.id}
        connected={connected}
        typingUsers={typingUsers}
        onlinePresences={onlinePresences}
        onSendMessage={handleSendMessage}
        onTyping={startTyping}
        onUpdateMessage={handleUpdateMessage}
        onDeleteMessage={handleDeleteMessage}
        onToggleReaction={handleToggleReaction}
      />

      <NewConversationModal
        isOpen={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        onSubmit={handleCreateNewConversation}
        isSubmitting={submittingNew}
      />
    </div>
  );
}

