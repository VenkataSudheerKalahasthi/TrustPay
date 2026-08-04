import { useState } from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function ShareLinkModal({ isOpen, onClose, onGenerateShare }) {
  const [password, setPassword] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await onGenerateShare({ password: password || undefined, expiresInDays });
      setGeneratedResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedResult?.shareUrl) {
      navigator.clipboard.writeText(generatedResult.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface-900 border border-surface-800 shadow-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <Share2 size={16} className="text-primary-400" />
            <span>Generate Password-Protected Share Link</span>
          </h3>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100">
            <X size={16} />
          </button>
        </div>

        {generatedResult ? (
          <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/30 text-primary-300 space-y-2">
            <div className="flex items-center justify-between text-3xs font-bold">
              <span>Secure Sharing Link Created</span>
              <button onClick={handleCopy} className="hover:underline flex items-center gap-1">
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="block text-3xs font-mono bg-surface-950 p-2 rounded text-surface-100 break-all select-all">
              {generatedResult.shareUrl}
            </code>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-3xs font-mono text-surface-400 block mb-1">Optional Password Protection</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for public link..."
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-3xs font-mono text-surface-400 block mb-1">Link Expiration (Days)</label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              >
                <option value={1}>1 Day</option>
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>

            <Button size="sm" variant="primary" fullWidth type="submit" isLoading={loading}>
              Create Sharing Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
