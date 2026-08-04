import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@components/common/Navbar';
import { Footer } from '@components/common/Footer';
import { cn } from '@utils';

/**
 * AppLayout
 *
 * The primary layout for all public-facing pages.
 * Renders the Navbar, main content area, and Footer.
 *
 * Authenticated layouts (Client/Worker/Admin) will have their own
 * dedicated layouts with Sidebar in Phase 2.
 */
export function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div id="app-layout" className="flex flex-col min-h-screen bg-surface-950">
      <Navbar />

      <main
        id="app-main-content"
        className={cn('flex-1', !isHomePage && 'pt-16')}
        role="main"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
