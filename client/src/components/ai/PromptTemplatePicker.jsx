import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { aiService } from '@services/ai.service';

export function PromptTemplatePicker({ isOpen, onClose, onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function loadTemplates() {
      setLoading(true);
      try {
        const data = await aiService.getPromptTemplates();
        setTemplates(data.templates || []);
      } catch (err) {
        console.error('Failed to load prompt templates', err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface-900 border border-surface-800 shadow-2xl overflow-hidden flex flex-col max-h-[30rem]">
        <div className="p-4 border-b border-surface-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <Sparkles size={16} className="text-primary-400" />
            <span>AI Prompt Templates</span>
          </h3>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-xs text-surface-400 text-center">Loading prompt templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-xs text-surface-400 text-center">No prompt templates available.</p>
          ) : (
            templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => {
                  onSelectTemplate(tpl.promptText);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl bg-surface-800/60 hover:bg-surface-800 border border-surface-700/60 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-surface-100">{tpl.title}</span>
                  <span className="text-3xs font-mono uppercase font-semibold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-2xs text-surface-300 line-clamp-2 leading-relaxed">{tpl.promptText}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
