export function TimelineItem({ title, description, timestamp, icon: Icon, isLast = false }) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <span className="absolute left-4 top-8 bottom-0 w-0.5 bg-surface-700/60 -ml-px" />
      )}
      <div className="w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-primary-400 shrink-0 z-10">
        {Icon ? <Icon size={14} /> : <span className="w-2 h-2 rounded-full bg-primary-500" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-surface-200">{title}</h4>
          {timestamp && <span className="text-2xs text-surface-500">{timestamp}</span>}
        </div>
        {description && <p className="text-xs text-surface-400 mt-1 leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}
