export function HiringPipelineBar({ currentStage = 'SUBMITTED' }) {
  const stages = [
    { key: 'SUBMITTED', label: 'Applied' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'OFFERED', label: 'Offered' },
    { key: 'ACCEPTED', label: 'Hired' },
  ];

  const currentIdx = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="flex items-center w-full gap-1 p-1 bg-surface-950 rounded-xl border border-surface-800">
      {stages.map((stage, idx) => {
        const isCurrent = stage.key === currentStage;
        const isCompleted = currentIdx > idx;

        return (
          <div
            key={stage.key}
            className={`flex-1 text-center py-1.5 px-1 rounded-lg text-3xs font-bold font-mono transition-all ${
              isCurrent
                ? 'bg-primary-500 text-surface-950 shadow-md'
                : isCompleted
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-surface-500'
            }`}
          >
            {stage.label}
          </div>
        );
      })}
    </div>
  );
}
