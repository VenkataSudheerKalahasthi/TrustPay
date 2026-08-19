import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Wallet,
  MessageSquare,
  Bell,
  Settings,
  ChevronLeft,
  Shield,
  User,
  Users,
  Activity,
  CreditCard,
  Bot,
  Search,
  Bookmark,
  Building2,
  Key,
  Radio,
  Layers,
  ToggleLeft,
  Sliders,
  Megaphone,
  Database,
  FileCheck,
  Briefcase,
  Sparkles,
  Clock,
  Headset,
  DollarSign,
  BarChart3,
  ShieldCheck,
  PieChart,
  Calendar,
  Target,
  X,
  Gauge,
} from 'lucide-react';
import { cn } from '@utils';
import { ROUTES, STORAGE_KEYS } from '@constants';
import { useAuth } from '@hooks/useAuth';
import { Badge } from '@components/ui/Badge';

const roleMenus = {
  CLIENT: [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/client' },
    { icon: Users, label: 'Workers / Freelancers', href: '/workers' },
    { icon: ShieldCheck, label: 'Platform Governance', href: '/dashboard/client/platform' },
    { icon: BarChart3, label: 'Executive BI & Analytics', href: '/dashboard/client/bi' },
    { icon: DollarSign, label: 'Finance & Billing', href: '/dashboard/client/finance' },
    { icon: Headset, label: 'Support & Service Desk', href: '/dashboard/client/support' },
    { icon: Clock, label: 'Workforce Operations', href: '/dashboard/client/workforce' },
    { icon: Briefcase, label: 'Talent Marketplace', href: '/dashboard/client/marketplace' },
    { icon: Users, label: 'Talent Discovery', href: '/dashboard/client/talent' },
    { icon: FolderOpen, label: 'Talent Pools', href: '/dashboard/client/talent/pools' },
    { icon: Sparkles, label: 'AI Recommendations', href: '/dashboard/client/talent/recommendations' },
    { icon: Bot, label: 'AI Assistant', href: '/dashboard/client/ai' },
    { icon: Search, label: 'Global Search', href: '/dashboard/client/search' },
    { icon: Activity, label: 'Analytics', href: '/dashboard/client/analytics' },
    { icon: FolderOpen, label: 'Projects', href: '/dashboard/client/projects' },
    { icon: FileText, label: 'Contracts', href: '/dashboard/client/contracts' },
    { icon: Wallet, label: 'Wallet', href: '/dashboard/client/wallet' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/client/messages' },
    { icon: Building2, label: 'Organizations', href: '/dashboard/client/organizations' },
    { icon: Users, label: 'Org Members & RBAC', href: '/dashboard/client/members' },
    { icon: Key, label: 'API Keys', href: '/dashboard/client/api-keys' },
    { icon: Radio, label: 'Webhooks', href: '/dashboard/client/webhooks' },
    { icon: Layers, label: 'Integration Hub', href: '/dashboard/client/integrations' },
    { icon: Shield, label: 'Security Center', href: '/dashboard/client/security' },
    { icon: FolderOpen, label: 'File Manager', href: '/dashboard/client/files' },
    { icon: Activity, label: 'Operations Center', href: '/dashboard/client/operations' },
    { icon: FileCheck, label: 'Compliance & GDPR', href: '/dashboard/client/compliance' },
    { icon: Bookmark, label: 'Bookmarks & Shortcuts', href: '/dashboard/client/bookmarks' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/client/notifications' },
    { icon: Activity, label: 'Activity Center', href: '/dashboard/client/activity' },
    { icon: Settings, label: 'Preferences', href: '/dashboard/client/preferences' },
  ],
  WORKER: [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/worker' },
    { icon: ShieldCheck, label: 'Platform Governance', href: '/dashboard/worker/platform' },
    { icon: BarChart3, label: 'Executive BI & Analytics', href: '/dashboard/worker/bi' },
    { icon: DollarSign, label: 'Finance & Billing', href: '/dashboard/worker/finance' },
    { icon: Headset, label: 'Support & Service Desk', href: '/dashboard/worker/support' },
    { icon: Clock, label: 'Workforce Operations', href: '/dashboard/worker/workforce' },
    { icon: Briefcase, label: 'Opportunities Explorer', href: '/dashboard/worker/marketplace' },
    { icon: Bot, label: 'AI Assistant', href: '/dashboard/worker/ai' },
    { icon: Search, label: 'Global Search', href: '/dashboard/worker/search' },
    { icon: Activity, label: 'Performance Analytics', href: '/dashboard/worker/analytics' },
    { icon: FolderOpen, label: 'My Projects', href: '/dashboard/worker/projects' },
    { icon: FileText, label: 'Contracts', href: '/dashboard/worker/contracts' },
    { icon: Wallet, label: 'Earnings & Wallet', href: '/dashboard/worker/wallet' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/worker/messages' },
    { icon: Bookmark, label: 'Bookmarks & Shortcuts', href: '/dashboard/worker/bookmarks' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/worker/notifications' },
    { icon: Activity, label: 'Activity Center', href: '/dashboard/worker/activity' },
    { icon: Settings, label: 'Preferences', href: '/dashboard/worker/preferences' },
  ],
  ADMIN: [
    { icon: LayoutDashboard, label: 'Executive Admin Control Center', href: '/dashboard/admin' },
    { icon: BarChart3, label: 'Executive Analytics Portal', href: '/dashboard/admin/executive-analytics' },
    { icon: FileText, label: 'Executive AI Reports', href: '/dashboard/admin/executive-analytics/reports' },
    { icon: PieChart, label: 'Enterprise Analytics Center', href: '/dashboard/admin/executive-analytics/center' },
    { icon: Calendar, label: 'Scheduled Report Subscriptions', href: '/dashboard/admin/executive-analytics/scheduler' },
    { icon: Bell, label: 'Executive Anomaly Alerts', href: '/dashboard/admin/executive-analytics/alerts' },
    { icon: Target, label: 'KPI Benchmark Scorecards', href: '/dashboard/admin/executive-analytics/benchmarks' },
    { icon: Sliders, label: 'Dashboard Layout Builder', href: '/dashboard/admin/executive-analytics/customization' },
    { icon: Users, label: 'User & Worker Administration', href: '/dashboard/admin/users' },
    { icon: FileText, label: 'Contract Oversight', href: '/dashboard/admin/contracts-oversight' },
    { icon: Wallet, label: 'Wallet Oversight & Freeze', href: '/dashboard/admin/wallets-oversight' },
    { icon: ShieldCheck, label: 'Verification Center', href: '/dashboard/admin/verifications' },
    { icon: Megaphone, label: 'Announcements Center', href: '/dashboard/admin/announcements-center' },
    { icon: Layers, label: 'Bulk Operations Runner', href: '/dashboard/admin/bulk-operations' },
    { icon: Activity, label: 'Real-Time Platform Monitoring', href: '/dashboard/admin/monitoring' },
    { icon: Shield, label: 'Administrative Audit History', href: '/dashboard/admin/audit-history' },
    { icon: ShieldCheck, label: 'Platform Governance & Control', href: '/dashboard/admin/platform' },
    { icon: BarChart3, label: 'Executive Decision Intelligence', href: '/dashboard/admin/bi' },
    { icon: DollarSign, label: 'Finance & Billing Operations', href: '/dashboard/admin/finance' },
    { icon: Headset, label: 'Support & Service Operations', href: '/dashboard/admin/support' },
    { icon: Clock, label: 'Workforce Operations', href: '/dashboard/admin/workforce' },
    { icon: Briefcase, label: 'Talent Marketplace', href: '/dashboard/admin/marketplace' },
    { icon: Users, label: 'Talent Discovery', href: '/dashboard/admin/talent' },
    { icon: Building2, label: 'Organizations', href: '/dashboard/admin/organizations' },
    { icon: Users, label: 'Members & RBAC', href: '/dashboard/admin/members' },
    { icon: ToggleLeft, label: 'Feature Flags', href: '/dashboard/admin/feature-flags' },
    { icon: Sliders, label: 'Platform Settings', href: '/dashboard/admin/settings' },
    { icon: Megaphone, label: 'Announcements', href: '/dashboard/admin/announcements' },
    { icon: Key, label: 'API Keys', href: '/dashboard/admin/api-keys' },
    { icon: Radio, label: 'Webhooks', href: '/dashboard/admin/webhooks' },
    { icon: Layers, label: 'Integration Hub', href: '/dashboard/admin/integrations' },
    { icon: Shield, label: 'Security Center', href: '/dashboard/admin/security' },
    { icon: FolderOpen, label: 'File Manager', href: '/dashboard/admin/files' },
    { icon: Activity, label: 'Operations Center', href: '/dashboard/admin/operations' },
    { icon: Database, label: 'Backup Metadata', href: '/dashboard/admin/backups' },
    { icon: FileCheck, label: 'Compliance & GDPR', href: '/dashboard/admin/compliance' },
    { icon: Bot, label: 'AI Platform Assistant', href: '/dashboard/admin/ai' },
    { icon: Search, label: 'Global Search', href: '/dashboard/admin/search' },
    { icon: Activity, label: 'System Analytics', href: '/dashboard/admin/analytics' },
    { icon: FileText, label: 'Reports Workspace', href: '/dashboard/admin/reports' },
    { icon: Users, label: 'User Management', href: '/dashboard/admin/users' },
    { icon: FileText, label: 'All Contracts', href: '/dashboard/admin/contracts' },
    { icon: CreditCard, label: 'Escrow Wallet', href: '/dashboard/admin/escrow' },
    { icon: Activity, label: 'System Activity Center', href: '/dashboard/admin/activity' },
    { icon: Settings, label: 'System Preferences', href: '/dashboard/admin/preferences' },
    { icon: Gauge, label: 'Performance Center', href: '/dashboard/admin/performance' },
    { icon: ShieldCheck, label: 'Release Management', href: '/dashboard/admin/release' },
  ],
};

export function Sidebar({ isOpen = true, onClose, role = 'CLIENT' }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true';
  });
  const location = useLocation();
  const { user } = useAuth();

  const activeRole = user?.role || role || 'CLIENT';
  const menuItems = roleMenus[activeRole] || roleMenus.CLIENT;

  const basePath = `/dashboard/${activeRole.toLowerCase()}`;
  const bottomNav = [
    { icon: User, label: 'Profile', href: `${basePath}/profile` },
    { icon: Settings, label: 'Settings', href: `${basePath}/settings` },
  ];

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
  };

  const isActive = (href) => {
    if (href === basePath) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-sidebar-overlay bg-card/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel (Desktop + Mobile Drawer) */}
      <aside
        id="app-sidebar"
        className={cn(
          'fixed left-0 top-0 z-sidebar h-screen bg-card border-r border-surface-200 flex flex-col transition-all duration-300 shadow-sm',
          collapsed ? 'lg:w-[4.5rem]' : 'lg:w-64',
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            {(!collapsed || isOpen) && (
              <span className="font-display font-bold text-lg text-surface-900 truncate">
                Trust<span className="gradient-text">Pay</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-surface-500 hover:text-surface-900 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Role Badge */}
        {(!collapsed || isOpen) && (
          <div className="px-4 py-2 border-b border-surface-200/60 bg-surface-50 flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-surface-500">
              Role Workspace
            </span>
            <Badge
              variant={activeRole === 'ADMIN' ? 'danger' : activeRole === 'WORKER' ? 'secondary' : 'primary'}
              size="sm"
            >
              {activeRole}
            </Badge>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide" aria-label="Sidebar navigation">
          <ul className="flex flex-col gap-1">
            {menuItems.map(({ icon: Icon, label, href }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    to={href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                      active
                        ? 'bg-primary-50 text-primary-700 border border-primary-200 font-semibold shadow-sm'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    )}
                  >
                    <Icon size={20} className="shrink-0" />
                    {(!collapsed || isOpen) && (
                      <span className="flex-1 whitespace-nowrap overflow-hidden">{label}</span>
                    )}
                    {collapsed && !isOpen && (
                      <span className="absolute left-full ml-3 px-2.5 py-1 text-xs bg-card text-surface-900 rounded-lg border border-surface-200 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-md">
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-2 py-3 border-t border-surface-200">
          {bottomNav.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              to={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative mb-1',
                isActive(href)
                  ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
              )}
            >
              <Icon size={20} className="shrink-0" />
              {(!collapsed || isOpen) && (
                <span className="whitespace-nowrap overflow-hidden">{label}</span>
              )}
              {collapsed && !isOpen && (
                <span className="absolute left-full ml-3 px-2.5 py-1 text-xs bg-card text-surface-900 rounded-lg border border-surface-200 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-md">
                  {label}
                </span>
              )}
            </Link>
          ))}

          {/* Collapse Toggle (Desktop only) */}
          <button
            id="sidebar-collapse-btn"
            onClick={toggleCollapsed}
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-all duration-200 w-full mt-1"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              size={20}
              className={cn('shrink-0 transition-transform duration-300', collapsed && 'rotate-180')}
            />
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

