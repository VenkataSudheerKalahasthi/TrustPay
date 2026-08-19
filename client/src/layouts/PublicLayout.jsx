import { Outlet } from 'react-router-dom';
import { Navbar } from '@components/common/Navbar';
import { Footer } from '@components/common/Footer';
import { ToastContainer } from '@components/ui/Toast';

export function PublicLayout() {
  return (
    <div id="public-layout" className="flex flex-col min-h-screen bg-card text-surface-900">
      <Navbar />
      <main id="public-main-content" className="flex-1 pt-14" role="main">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

