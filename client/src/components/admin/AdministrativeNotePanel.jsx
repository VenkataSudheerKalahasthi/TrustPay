import { useState } from 'react';
import { FileText, Send } from 'lucide-react';

export function AdministrativeNotePanel({ onAddNote }) {
  const [targetUserId, setTargetUserId] = useState('');
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddNote && targetUserId && noteText) {
      onAddNote(targetUserId, noteText);
      setNoteText('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <FileText className="w-5 h-5 text-sky-400 dark:text-primary-400" />
        Add Administrative User Note
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Target User ID</label>
          <input
            type="text"
            required
            placeholder="e.g. usr_123456789"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Administrative Note</label>
          <textarea
            rows={3}
            required
            placeholder="Enter confidential compliance or operational notes..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-sky-600/20"
        >
          <Send className="w-3.5 h-3.5" /> Save Note
        </button>
      </form>
    </div>
  );
}
