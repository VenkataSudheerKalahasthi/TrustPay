import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, Sparkles, Pin, Archive, Plus, RefreshCw } from 'lucide-react';
import { aiService } from '@services/ai.service';
import { AIMessageBubble } from './AIMessageBubble';
import { QuickPromptCards } from './QuickPromptCards';
import { PromptTemplatePicker } from './PromptTemplatePicker';

export function AIChatPanel({ initialContextType = null, initialContextId = null }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [sending, setSending] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await aiService.getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  }, []);

  const loadConversationMessages = useCallback(async (convId) => {
    try {
      const data = await aiService.getConversation(convId);
      if (data.conversation) {
        setActiveConversationId(convId);
        setMessages(data.conversation.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversation details', err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendPrompt = async (promptText = prompt, action = 'CHAT') => {
    const textToSend = promptText.trim();
    if (!textToSend || sending) return;

    setSending(true);
    setPrompt('');

    // Optimistic user message preview
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const result = await aiService.processPrompt({
        prompt: textToSend,
        conversationId: activeConversationId || undefined,
        contextType: initialContextType,
        contextId: initialContextId,
        action,
      });

      setActiveConversationId(result.conversationId);
      await fetchConversations();
      await loadConversationMessages(result.conversationId);
    } catch (err) {
      console.error('Failed to send prompt to AI Assistant', err);
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setPrompt('');
  };

  const handleTogglePin = async (id, isPinned) => {
    await aiService.togglePin(id, !isPinned);
    fetchConversations();
  };

  const handleToggleArchive = async (id, isArchived) => {
    await aiService.toggleArchive(id, !isArchived);
    fetchConversations();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-10rem)] max-w-7xl mx-auto">
      {/* Sidebar: Conversation List */}
      <div className="lg:col-span-1 bg-card border border-surface-200 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-200">
          <h3 className="text-xs font-bold text-surface-900 flex items-center gap-2">
            <Bot size={16} className="text-primary-600" />
            <span>AI Chats</span>
          </h3>
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-500/20 transition-colors text-3xs font-semibold flex items-center gap-1"
            title="Start New Chat"
          >
            <Plus size={14} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {conversations.length === 0 ? (
            <p className="text-3xs text-surface-600 text-center py-6">No chat memory yet.</p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className={`p-2.5 rounded-xl text-xs flex items-center justify-between group transition-all ${
                  activeConversationId === c.id
                    ? 'bg-primary-500/20 border border-primary-600/40 text-primary-700'
                    : 'bg-surface-50/50 hover:bg-surface-50 text-surface-700'
                }`}
              >
                <button
                  onClick={() => loadConversationMessages(c.id)}
                  className="flex-1 text-left font-semibold truncate pr-2"
                >
                  {c.title}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePin(c.id, c.isPinned)}
                    className={`p-1 hover:text-amber-400 ${c.isPinned ? 'text-amber-400 opacity-100' : ''}`}
                    title="Pin Conversation"
                  >
                    <Pin size={12} />
                  </button>
                  <button
                    onClick={() => handleToggleArchive(c.id, c.isArchived)}
                    className="p-1 hover:text-surface-900"
                    title="Archive"
                  >
                    <Archive size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main AI Workspace Feed */}
      <div className="lg:col-span-3 bg-card border border-surface-200 rounded-2xl flex flex-col h-full overflow-hidden">
        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-6 my-auto pt-8">
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto shadow">
                  <Bot size={24} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-surface-900">TrustPay Enterprise AI Assistant</h2>
                <p className="text-xs text-surface-600">
                  Powered by Google Gemini. Ask anything about contracts, project timelines, escrow balances, or writing assistance.
                </p>
              </div>

              <QuickPromptCards onSelectPrompt={(p, a) => handleSendPrompt(p, a)} />
            </div>
          ) : (
            messages.map((m) => <AIMessageBubble key={m.id} message={m} />)
          )}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-primary-600 p-3 bg-primary-50 border border-primary-100 rounded-xl animate-pulse">
              <RefreshCw size={14} className="animate-spin" />
              <span>TrustPay AI is compiling context & generating completion...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer Bar */}
        <div className="p-3 bg-card border-t border-surface-200 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setTemplatePickerOpen(true)}
              className="p-2.5 rounded-xl bg-surface-50 border border-surface-300 text-surface-600 hover:text-surface-900 transition-colors"
              title="Open Prompt Templates"
            >
              <Sparkles size={16} />
            </button>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask TrustPay AI or paste document text..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-surface-200 text-xs text-surface-900 placeholder-surface-500 focus:outline-none focus:border-primary-600"
            />

            <button
              type="submit"
              disabled={!prompt.trim() || sending}
              className="p-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white transition-all shadow"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <PromptTemplatePicker
        isOpen={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
        onSelectTemplate={(text) => setPrompt(text)}
      />
    </div>
  );
}

