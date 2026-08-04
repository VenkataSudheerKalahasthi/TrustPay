import { FileText, Download, Share2, Star, ShieldCheck } from 'lucide-react';

export function FileCard({ file, onShare, onToggleFavorite }) {
  const isClean = file.virusScan?.status === 'CLEAN';

  return (
    <div className="p-4 rounded-2xl bg-surface-900 border border-surface-800 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-primary-500/10 text-primary-400 shrink-0">
            <FileText size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-surface-100 truncate">{file.name}</h4>
            <span className="text-3xs font-mono text-surface-400">{(file.sizeBytes / 1024).toFixed(1)} KB</span>
          </div>
        </div>

        <button
          onClick={() => onToggleFavorite(file.id, !file.isFavorite)}
          className={`p-1.5 rounded-lg hover:bg-surface-800 transition-colors ${file.isFavorite ? 'text-amber-400' : 'text-surface-500'}`}
        >
          <Star size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between text-3xs font-mono text-surface-400 pt-2 border-t border-surface-800">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck size={12} />
          <span>{isClean ? 'SHA-256 Verified' : 'Scanning'}</span>
        </span>

        <div className="flex items-center gap-2">
          <button onClick={() => onShare(file.id)} className="hover:text-surface-100 p-1">
            <Share2 size={12} />
          </button>
          <a href={file.signedUrl} target="_blank" rel="noreferrer" className="hover:text-primary-400 p-1">
            <Download size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
