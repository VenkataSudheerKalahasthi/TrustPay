import { Box } from 'lucide-react';

export function BundleAnalysisCard({ analyses = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Box className="w-5 h-5 text-purple-400" /> Client Bundle Breakdown
        </h3>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Code-Split Active</span>
      </div>
      <div className="space-y-3">
        {analyses.map((b, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="font-mono text-slate-300">{b.chunkName}</span>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-slate-400">{b.sizeKb} KB</span>
              <span className="text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">gzip: {b.gzipKb} KB</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
