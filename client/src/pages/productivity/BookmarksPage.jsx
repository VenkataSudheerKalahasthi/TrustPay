import { QuickActionsPanel } from '@components/productivity/QuickActionsPanel';
import { Bookmark } from 'lucide-react';

export function BookmarksPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
          <Bookmark size={20} className="text-amber-400" />
          <span>Productivity & Bookmarks Workspace</span>
        </h1>
        <p className="text-xs text-surface-600">
          Quickly access pinned workspace views, saved bookmarks, and recently visited projects.
        </p>
      </div>

      <QuickActionsPanel />
    </div>
  );
}

