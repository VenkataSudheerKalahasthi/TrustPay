import { GitCommit } from 'lucide-react';

export function ReleaseTimeline({ versions = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <GitCommit className="w-5 h-5 text-sky-400" />
        Release Timeline & Version History
      </h3>

      <div className="space-y-4 pt-2 border-t border-slate-800">
        {versions.map((v) => (
          <div key={v.id} className="flex gap-4 items-start">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-full mt-0.5">
              <GitCommit className="w-4 h-4" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-mono">
                  v{v.version} ({v.buildNumber})
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(v.releaseDate).toLocaleDateString()}
                </span>
              </div>

              {v.releaseNotes?.map((note) => (
                <p key={note.id} className="text-xs text-slate-300">
                  <span className="text-sky-400 font-bold font-mono">[{note.category}]</span> {note.content}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
