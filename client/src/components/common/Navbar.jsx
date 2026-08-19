import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@utils';
import { ROUTES } from '@constants';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/ui/Button';
import { Avatar } from '@components/ui/Avatar';
import { Dropdown } from '@components/ui/Dropdown';
import { NotificationDropdown } from '@components/notification/NotificationDropdown';
import { GlobalSearchBar } from '@components/search/GlobalSearchBar';
import { CommandPalette } from '@components/productivity/CommandPalette';
import { WorkspaceSwitcher } from '@components/organization/WorkspaceSwitcher';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const roleDashboardRoute = user
    ? user.role === 'ADMIN'
      ? '/dashboard/admin'
      : user.role === 'WORKER'
        ? '/dashboard/worker'
        : '/dashboard/client'
    : '/dashboard';

  const userMenuItems = [
    {
      label: `Dashboard (${user?.role})`,
      icon: LayoutDashboard,
      onClick: () => {
        window.location.href = roleDashboardRoute;
      },
    },
    {
      label: 'Profile Settings',
      icon: UserIcon,
      onClick: () => {
        window.location.href = `${roleDashboardRoute}/profile`;
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
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-navbar transition-all duration-300',
          isScrolled
            ? 'bg-surface-950/95 backdrop-blur-xl border-b border-surface-800 shadow-glow-sm'
            : 'bg-surface-950/80 backdrop-blur-md border-b border-surface-800/60'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 group" id="nav-logo">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-display font-bold text-xl text-surface-50">
                Trust<span className="gradient-text">Pay</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-surface-50 rounded-lg hover:bg-surface-800/50 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
                <WorkspaceSwitcher />
                <GlobalSearchBar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
              </div>
            )}

            <div className="flex items-center gap-2">

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-3">
                  <NotificationDropdown />

                  <Link to={roleDashboardRoute}>
                    <Button variant="primary" size="sm" leftIcon={<LayoutDashboard size={16} />}>
                      Dashboard
                    </Button>
                  </Link>

                  <Dropdown
                    trigger={
                      <Avatar
                        name={`${user.firstName || ''} ${user.lastName || ''}`}
                        src={user.avatar}
                        size="sm"
                        status="online"
                      />
                    }
                    items={userMenuItems}
                  />
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" id="nav-login-btn">
                    <Link to={ROUTES.LOGIN}>Sign In</Link>
                  </Button>
                  <Button variant="primary" size="sm" id="nav-register-btn">
                    <Link to={ROUTES.REGISTER}>Get Started</Link>
                  </Button>
                </div>
              )}

              <button
                id="nav-mobile-menu-btn"
                onClick={() => setIsMobileOpen((v) => !v)}
                className="lg:hidden p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-all duration-200"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="nav-mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-navbar bg-surface-900/95 backdrop-blur-xl border-b border-surface-800 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-surface-300 hover:text-surface-100 hover:bg-surface-800 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-surface-700/50 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to={roleDashboardRoute} className="w-full">
                      <Button variant="primary" fullWidth leftIcon={<LayoutDashboard size={16} />}>
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button variant="danger" fullWidth onClick={logout} leftIcon={<LogOut size={16} />}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" fullWidth id="mobile-login-btn">
                      <Link to={ROUTES.LOGIN}>Sign In</Link>
                    </Button>
                    <Button variant="primary" fullWidth id="mobile-register-btn">
                      <Link to={ROUTES.REGISTER}>Get Started Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </>
  );
}
