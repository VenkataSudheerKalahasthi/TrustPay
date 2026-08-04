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
  Sun,
  Moon,
  ChevronRight,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Bell,
  Search,
} from 'lucide-react';

export function DashboardLayout({ role = 'CLIENT' }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
    <div id="dashboard-layout" className="min-h-screen bg-surface-950 text-surface-50 flex flex-col">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        role={activeRole}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 border-b border-surface-800 bg-surface-900/80 backdrop-blur-xl sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-surface-400">
              <Link to="/" className="hover:text-surface-200 transition-colors">
                Home
              </Link>
              {breadcrumbs.map((b, idx) => (
                <div key={b.href} className="flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-surface-600" />
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-surface-200 font-semibold">{b.label}</span>
                  ) : (
                    <Link to={b.href} className="hover:text-surface-200 transition-colors">
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
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/80 border border-surface-700/60 text-xs text-surface-400">
              <Search size={14} />
              <span>Search workspace...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-surface-700 text-2xs text-surface-300">
                ⌘K
              </kbd>
            </div>

            {/* Notifications Button */}
            <button
              type="button"
              className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-6 w-px bg-surface-800" />

            {/* User Profile Dropdown */}
            {user && (
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                    <Avatar
                      name={`${user.firstName || ''} ${user.lastName || ''}`}
                      src={user.avatar}
                      size="sm"
                      status="online"
                    />
                    <div className="hidden md:flex flex-col text-left leading-tight">
                      <span className="text-xs font-semibold text-surface-100">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-2xs text-surface-400">{user.email}</span>
                    </div>
                  </div>
                }
                items={userMenuItems}
              />
            )}
          </div>
        </header>

        {/* Reusable Page Header Banner */}
        <div className="bg-surface-900/40 border-b border-surface-800/60 px-4 sm:px-6 lg:px-8 py-6">
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
