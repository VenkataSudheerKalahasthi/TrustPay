import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, Search, FolderOpen, FileText, Wallet, MessageSquare, Bot, Activity, Settings, X } from 'lucide-react';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands = [
    { id: 'ai', title: 'Open AI Assistant Workspace', icon: Bot, href: '/ai' },
    { id: 'projects', title: 'View All Projects', icon: FolderOpen, href: '/dashboard/client/projects' },
    { id: 'contracts', title: 'View Contracts & Signatures', icon: FileText, href: '/dashboard/client/contracts' },
    { id: 'wallet', title: 'View Escrow Wallet Balance', icon: Wallet, href: '/dashboard/client/wallet' },
    { id: 'messages', title: 'Open Realtime Chat Messages', icon: MessageSquare, href: '/dashboard/client/messages' },
    { id: 'analytics', title: 'View Business Analytics & Reports', icon: Activity, href: '/dashboard/client/analytics' },
    { id: 'preferences', title: 'User & System Preferences', icon: Settings, href: '/dashboard/client/preferences' },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          onClose();
          navigate(selected.href);
        } else if (query) {
          onClose();
          navigate(`/search?query=${encodeURIComponent(query)}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredCommands, selectedIndex, query, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-card/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-card border border-surface-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Input */}
        <div className="p-4 border-b border-surface-200 flex items-center gap-3">
          <Command size={18} className="text-primary-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search workspace... (Esc to close)"
            className="w-full bg-transparent text-sm text-surface-900 placeholder-surface-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-surface-600 hover:text-surface-900">
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="p-2 max-h-80 overflow-y-auto divide-y divide-surface-800/40">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-surface-600">
              <Search size={24} className="mx-auto mb-2 text-surface-600" />
              <span>Press Enter to perform global search for "{query}"</span>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onClose();
                    navigate(cmd.href);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                    isSelected ? 'bg-primary-500 text-white shadow' : 'text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{cmd.title}</span>
                  </div>
                  <span className="text-3xs font-mono opacity-60">Jump →</span>
                </button>
              );
            })
          )}
        </div>

        <div className="p-2.5 bg-card border-t border-surface-200 flex items-center justify-between text-3xs font-mono text-surface-600">
          <span>Navigation: ↑↓ Arrow Keys</span>
          <span>Select: Enter</span>
        </div>
      </div>
    </div>
  );
}

