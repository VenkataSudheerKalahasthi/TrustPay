import { useState } from 'react';
import { Key, Copy, Check, Trash2, ShieldAlert } from 'lucide-react';

export function ApiKeyCard({ apiKey, rawKey, onRevoke }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (rawKey) {
      navigator.clipboard.writeText(rawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-card border border-surface-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <Key size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-900">{apiKey.name}</h4>
            <span className="text-3xs font-mono text-surface-600">Prefix: {apiKey.keyPrefix}...</span>
          </div>
        </div>

        <button
          onClick={() => onRevoke(apiKey.id)}
          className="p-2 rounded-xl text-surface-600 hover:text-red-400 hover:bg-surface-50 transition-colors"
          title="Revoke API Key"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {rawKey && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
          <div className="flex items-center justify-between text-3xs font-bold">
            <span className="flex items-center gap-1">
              <ShieldAlert size={12} />
              <span>Copy API Secret Key (Shown Only Once)</span>
            </span>
            <button onClick={handleCopy} className="hover:underline flex items-center gap-1">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
          <code className="block text-xs font-mono bg-card p-2 rounded text-surface-900 break-all select-all">
            {rawKey}
          </code>
        </div>
      )}

      <div className="flex items-center justify-between text-3xs font-mono text-surface-600 pt-2 border-t border-surface-200">
        <span>Scope: {apiKey.scopes}</span>
        <span>Expires: {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleDateString() : 'Never'}</span>
      </div>
    </div>
  );
}

