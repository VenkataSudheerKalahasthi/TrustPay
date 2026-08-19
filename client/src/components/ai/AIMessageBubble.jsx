import { useState } from 'react';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { aiService } from '@services/ai.service';

export function AIMessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(message.feedbackScore || null);

  if (!message) return null;

  const isUser = message.role === 'USER';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = async (score) => {
    setFeedback(score);
    try {
      await aiService.submitFeedback(message.id, { feedbackScore: score });
    } catch (err) {
      console.error('Failed to submit AI feedback', err);
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl ${isUser ? 'bg-surface-100/80 ml-8' : 'bg-card border border-surface-200 mr-8'}`}>
      <div className={`p-2 rounded-xl shrink-0 ${isUser ? 'bg-indigo-500/20 text-indigo-400' : 'bg-primary-500/20 text-primary-600'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-surface-900">{isUser ? 'You' : 'TrustPay AI Assistant'}</span>
          <span className="text-3xs text-surface-600 font-mono">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="text-xs text-surface-800 whitespace-pre-wrap leading-relaxed space-y-2">
          {message.content}
        </div>

        {!isUser && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-200/60 text-3xs text-surface-600">
            <span className="font-mono">Tokens: {message.tokensUsed || 0}</span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="hover:text-surface-900 flex items-center gap-1 transition-colors"
                title="Copy AI Response"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <div className="flex items-center gap-1 border-l border-surface-200 pl-3">
                <button
                  onClick={() => handleFeedback(1)}
                  className={`p-1 rounded hover:bg-surface-50 ${feedback === 1 ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}
                  title="Thumbs Up"
                >
                  <ThumbsUp size={12} />
                </button>
                <button
                  onClick={() => handleFeedback(-1)}
                  className={`p-1 rounded hover:bg-surface-50 ${feedback === -1 ? 'text-red-400 font-bold' : 'hover:text-red-400'}`}
                  title="Thumbs Down"
                >
                  <ThumbsDown size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

