import { Sparkles, FileText, CheckSquare, Edit3 } from 'lucide-react';

export function QuickPromptCards({ onSelectPrompt }) {
  const suggestedPrompts = [
    {
      title: 'Summarize Contract Terms',
      desc: 'Extract key clauses, payment milestones, and obligations',
      icon: FileText,
      prompt: 'Please provide an executive summary of the contract deliverables, payment terms, and risks.',
      action: 'SUMMARIZE',
    },
    {
      title: 'Extract Action Deliverables',
      desc: 'Build a check-list of pending project deliverables',
      icon: CheckSquare,
      prompt: 'Extract all pending deliverables and action items from this project scope into a checkbox list.',
      action: 'EXTRACT_TASKS',
    },
    {
      title: 'Polish Message Tone',
      desc: 'Rewrite chat text into a professional corporate tone',
      icon: Edit3,
      prompt: 'Please rewrite my message to make it polite, professional, and clear.',
      action: 'PROFESSIONAL',
    },
    {
      title: 'Smart Escrow Compliance Check',
      desc: 'Verify milestone funding requirements before sign-off',
      icon: Sparkles,
      prompt: 'Check if the escrow wallet requirements are satisfied prior to releasing payments.',
      action: 'CHAT',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {suggestedPrompts.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt, item.action)}
            className="p-3.5 rounded-2xl bg-card border border-surface-200 hover:border-primary-600/50 hover:bg-surface-850 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-primary-50 border border-primary-600/30 text-primary-600 w-fit mb-2.5 group-hover:scale-105 transition-transform">
              <Icon size={16} />
            </div>
            <h4 className="text-xs font-bold text-surface-900 mb-1">{item.title}</h4>
            <p className="text-3xs text-surface-600 line-clamp-2">{item.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

