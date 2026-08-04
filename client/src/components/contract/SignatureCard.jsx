import { ShieldCheck, Clock, Globe } from 'lucide-react';
import { Badge } from '@components/ui/Badge';

export function SignatureCard({ title, role, signature, onSign, isCurrentSigner }) {
  const isSigned = signature && signature.signatureStatus === 'SIGNED';

  return (
    <div className="glass-card p-4 flex flex-col justify-between relative">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs font-bold text-surface-200">{title}</h4>
            <span className="text-2xs text-surface-500 font-mono">Role: {role}</span>
          </div>
          <Badge variant={isSigned ? 'success' : 'warning'}>
            {isSigned ? 'Signed' : 'Pending Signature'}
          </Badge>
        </div>

        {isSigned ? (
          <div className="space-y-2 bg-success-500/5 border border-success-500/20 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success-400">
              <ShieldCheck size={14} />
              <span>Digitally Signed</span>
            </div>

            <div className="text-2xs text-surface-400 space-y-1 font-mono">
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-surface-500" />
                <span>
                  {new Date(signature.signatureTimestamp).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Globe size={11} className="text-surface-500" />
                <span>IP: {signature.ipAddress || '127.0.0.1'}</span>
              </div>
              {signature.signatureHash && (
                <div className="truncate text-surface-500" title={signature.signatureHash}>
                  Hash: {signature.signatureHash.substring(0, 16)}...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-surface-900/60 p-4 rounded-xl border border-dashed border-surface-800 text-center">
            <p className="text-xs text-surface-400 mb-3">
              Awaiting digital signature from {role.toLowerCase()}.
            </p>

            {isCurrentSigner && onSign && (
              <button
                type="button"
                onClick={onSign}
                className="w-full py-2 px-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all"
              >
                Sign Contract Digitally
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
