import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '@components/common/Sidebar';
import { PageHeader } from '@components/common/PageHeader';
import { Footer } from '@components/common/Footer';
import { ToastContainer } from '@components/ui/Toast';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { Avatar } from '@components/ui/Avatar';
import { Dropdown } from '@components/ui/Dropdown';
import { Badge } from '@components/ui/Badge';
import {
  Menu,
  ChevronRight,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Bell,
  Search,
} from 'lucide-react';

import { NotificationDropdown } from '@components/notification/NotificationDropdown';

export function DashboardLayout({ role = 'CLIENT' }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const activeRole = user?.role || role;
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbs = () => {
    return pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, label };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard';

  const userMenuItems = [
    {
      label: 'Profile & Security',
      icon: UserIcon,
      onClick: () => {
        window.location.href = `/dashboard/${activeRole.toLowerCase()}/profile`;
      },
    },
    {
      label: 'Account Settings',
      icon: LayoutDashboard,
      onClick: () => {
        window.location.href = `/dashboard/${activeRole.toLowerCase()}/settings`;
      },
    },
    { divider: true },
    {
      label: 'Log Out',
      icon: LogOut,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <div id="dashboard-layout" className="min-h-screen bg-surface-50 text-surface-900 flex flex-col">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        role={activeRole}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 border-b border-surface-200 bg-card/80 backdrop-blur-xl sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-surface-600">
              <Link to="/" className="hover:text-surface-900 transition-colors">
                Home
              </Link>
              {breadcrumbs.map((b, idx) => (
                <div key={b.href} className="flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-surface-600" />
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-surface-900 font-semibold">{b.label}</span>
                  ) : (
                    <Link to={b.href} className="hover:text-surface-900 transition-colors">
                      {b.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input Preview */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-50 border border-surface-200 text-xs text-surface-600">
              <Search size={14} />
              <span>Search workspace...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-surface-200 text-2xs text-surface-600 shadow-sm">
                ⌘K
              </kbd>
            </div>

            {/* Realtime Notifications Dropdown */}
            <NotificationDropdown />

            <div className="h-6 w-px bg-surface-200" />

            {/* User Profile Dropdown */}
            {user && (
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                    <Avatar
                      name={`${user.firstName || ''} ${user.lastName || ''}`}
                      src={user.avatar}
                      size="sm"
                      status="online"
                    />
                    <div className="hidden md:flex flex-col text-left leading-tight">
                      <span className="text-xs font-semibold text-surface-900">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-2xs text-surface-500">{user.email}</span>
                    </div>
                  </div>
                }
                items={userMenuItems}
              />
            )}
          </div>
        </header>

        {/* Reusable Page Header Banner */}
        <div className="bg-card/40 border-b border-surface-200 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title={currentPageTitle}
              subtitle="Enterprise digital contracts and escrow operations framework."
              badge={
                <Badge
                  variant={activeRole === 'ADMIN' ? 'danger' : activeRole === 'WORKER' ? 'secondary' : 'primary'}
                  size="sm"
                >
                  {activeRole} PORTAL
                </Badge>
              }
            />
          </div>
        </div>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      <ToastContainer />
    </div>
  );
}

