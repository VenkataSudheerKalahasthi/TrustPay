import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pin, Bookmark, Clock, ExternalLink } from 'lucide-react';
import { productivityService } from '@services/productivity.service';
import { Card } from '@components/ui/Card';

export function QuickActionsPanel() {
  const [pinnedItems, setPinnedItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    async function loadProductivityData() {
      try {
        const [pinRes, bmRes, rvRes] = await Promise.all([
          productivityService.getPinnedItems(),
          productivityService.getBookmarks(),
          productivityService.getRecentlyViewed(),
        ]);
        setPinnedItems(pinRes.pinnedItems || []);
        setBookmarks(bmRes.bookmarks || []);
        setRecentlyViewed(rvRes.recentlyViewed || []);
      } catch (err) {
        console.error('Failed to load productivity items', err);
      }
    }
    loadProductivityData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pinned Items */}
      <Card className="p-4 bg-surface-900 border-surface-800 space-y-3">
        <h3 className="text-xs font-bold text-surface-100 flex items-center gap-2">
          <Pin size={14} className="text-primary-400" />
          <span>Pinned Workspaces ({pinnedItems.length})</span>
        </h3>
        <div className="space-y-1.5">
          {pinnedItems.length === 0 ? (
            <p className="text-3xs text-surface-400">No pinned items.</p>
          ) : (
            pinnedItems.map((item) => (
              <Link
                key={item.id}
                to={item.linkUrl}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-800/60 hover:bg-surface-800 text-xs font-semibold text-surface-200 transition-colors"
              >
                <span className="truncate">{item.title}</span>
                <ExternalLink size={10} className="text-surface-400 shrink-0" />
              </Link>
            ))
          )}
        </div>
      </Card>

      {/* Bookmarks */}
      <Card className="p-4 bg-surface-900 border-surface-800 space-y-3">
        <h3 className="text-xs font-bold text-surface-100 flex items-center gap-2">
          <Bookmark size={14} className="text-amber-400" />
          <span>Bookmarks ({bookmarks.length})</span>
        </h3>
        <div className="space-y-1.5">
          {bookmarks.length === 0 ? (
            <p className="text-3xs text-surface-400">No bookmarks saved.</p>
          ) : (
            bookmarks.map((bm) => (
              <Link
                key={bm.id}
                to={bm.linkUrl}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-800/60 hover:bg-surface-800 text-xs font-semibold text-surface-200 transition-colors"
              >
                <span className="truncate">{bm.title}</span>
                <ExternalLink size={10} className="text-surface-400 shrink-0" />
              </Link>
            ))
          )}
        </div>
      </Card>

      {/* Recently Viewed */}
      <Card className="p-4 bg-surface-900 border-surface-800 space-y-3">
        <h3 className="text-xs font-bold text-surface-100 flex items-center gap-2">
          <Clock size={14} className="text-emerald-400" />
          <span>Recently Viewed ({recentlyViewed.length})</span>
        </h3>
        <div className="space-y-1.5">
          {recentlyViewed.length === 0 ? (
            <p className="text-3xs text-surface-400">No recent history.</p>
          ) : (
            recentlyViewed.slice(0, 5).map((rv) => (
              <Link
                key={rv.id}
                to={rv.linkUrl}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-800/60 hover:bg-surface-800 text-xs font-semibold text-surface-200 transition-colors"
              >
                <span className="truncate">{rv.title}</span>
                <span className="text-3xs text-surface-500 shrink-0 font-mono">
                  {new Date(rv.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
