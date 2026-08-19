import { useState, useRef } from 'react';
import { Send, Paperclip, X, Smile } from 'lucide-react';
import { Button } from '@components/ui/Button';

const EMOJIS = ['👍', '❤️', '🔥', '🎉', '🚀', '👀', '💯', '✅', '🙏', '😊'];

export function MessageComposer({
  onSendMessage,
  onTyping,
  replyingTo,
  onClearReply,
  editingMessage,
  onClearEdit,
  onUpdateMessage,
}) {
  const [content, setContent] = useState(editingMessage ? editingMessage.content : '');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    setContent(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Process file attachments and compute SHA-256 metadata
    const uploadedList = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const hashArray = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buffer)));
        const sha256Hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        return {
          fileName: file.name,
          fileUrl: URL.createObjectURL(file), // Local preview URL
          fileSize: file.size,
          mimeType: file.type || 'application/octet-stream',
          sha256Hash,
          fileBuffer: buffer,
        };
      })
    );

    setAttachments((prev) => [...prev, ...uploadedList]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && attachments.length === 0) return;

    setSending(true);
    try {
      if (editingMessage) {
        await onUpdateMessage(editingMessage.id, content);
        onClearEdit();
      } else {
        await onSendMessage({
          content,
          parentMessageId: replyingTo ? replyingTo.id : null,
          attachments,
        });
        if (replyingTo) onClearReply();
      }
      setContent('');
      setAttachments([]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-3 bg-card border-t border-surface-200 space-y-2 relative">
      {/* Replying Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-surface-50 border-l-2 border-primary-600 text-xs">
          <div className="truncate">
            <span className="font-semibold text-primary-600 block text-2xs">
              Replying to {replyingTo.senderUser?.firstName}
            </span>
            <span className="text-surface-700 truncate block text-2xs">{replyingTo.content}</span>
          </div>
          <button onClick={onClearReply} className="text-surface-600 hover:text-surface-900 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Editing Banner */}
      {editingMessage && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-500/10 border-l-2 border-indigo-500 text-xs">
          <span className="font-semibold text-indigo-400 text-2xs">Editing message</span>
          <button onClick={onClearEdit} className="text-surface-600 hover:text-surface-900 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {attachments.map((att, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-50 border border-surface-300 text-2xs text-surface-800"
            >
              <span className="truncate max-w-[120px] font-mono">{att.fileName}</span>
              <button
                type="button"
                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                className="text-surface-600 hover:text-red-400"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Composer Form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl bg-surface-50 text-surface-600 hover:text-surface-900 hover:bg-surface-700 transition-colors shrink-0 mb-0.5"
          title="Attach file with SHA-256 integrity"
        >
          <Paperclip size={18} />
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-xl bg-surface-50 text-surface-600 hover:text-amber-400 hover:bg-surface-700 transition-colors shrink-0 mb-0.5"
          title="Add Emoji"
        >
          <Smile size={18} />
        </button>

        <textarea
          rows={1}
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Press Enter to send)"
          className="flex-1 px-3 py-2 rounded-xl bg-surface-50 border border-surface-300 text-xs text-surface-900 placeholder-surface-500 focus:outline-none focus:border-primary-600 resize-none max-h-32"
        />

        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() && attachments.length === 0}
          loading={sending}
          leftIcon={<Send size={14} />}
          className="shrink-0 mb-0.5"
        >
          Send
        </Button>
      </form>

      {/* Quick Emoji Bar */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-12 bg-card border border-surface-300 rounded-2xl p-2 flex flex-wrap gap-1 shadow-2xl z-modal max-w-xs">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setContent((prev) => prev + e);
                setShowEmojiPicker(false);
              }}
              className="p-1.5 hover:bg-surface-50 rounded-xl text-base transition-transform hover:scale-125"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

