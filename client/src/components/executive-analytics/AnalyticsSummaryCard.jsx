export function AnalyticsSummaryCard({ title, description, badgeText, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
        {badgeText && (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 dark:text-primary-400 border border-sky-500/20">
            {badgeText}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
