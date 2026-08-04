import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ProfileCompletionBar({ completionPercentage = 0, missingItems = [] }) {
  return (
    <div className="p-4 rounded-2xl bg-surface-900 border border-surface-800 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-surface-200">Profile Completion</span>
          <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 font-semibold border border-primary-500/20">
            {completionPercentage}%
          </span>
        </div>
        {completionPercentage === 100 ? (
          <div className="flex items-center gap-1 text-2xs text-success-400 font-semibold">
            <CheckCircle2 size={14} />
            <span>Profile Fully Complete</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-2xs text-warning-500 font-semibold">
            <AlertCircle size={14} />
            <span>Action Recommended</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-surface-950 rounded-full overflow-hidden border border-surface-800">
        <div
          className="h-full bg-gradient-brand transition-all duration-500 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Missing Items Checklist */}
      {missingItems.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          <span className="text-2xs text-surface-400">Missing:</span>
          {missingItems.map((item, idx) => (
            <span
              key={idx}
              className="text-2xs text-warning-500 bg-warning-500/10 px-2 py-0.5 rounded-md border border-warning-500/20"
            >
              + {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
